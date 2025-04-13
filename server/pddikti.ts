import axios, { AxiosError, AxiosInstance } from 'axios';
import { storage } from './storage';
import { db } from './db';
import { 
  insertSyncLogSchema, 
  syncLogs,
  students,
  lecturers, 
  courses, 
  departments,
  studyPrograms
} from '@shared/schema';
import { eq } from 'drizzle-orm';

class PDDiktiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    const baseURL = process.env.PDDIKTI_BASE_URL || 'https://api.pddikti.kemdikbud.go.id';
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add response interceptor for automatic token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // If error is 401 and we have originalRequest, try refresh token
        if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
          await this.authenticate();
          
          // Add retry flag to avoid infinite loop
          originalRequest.headers['X-Retry'] = 'true';
          
          // Add new token
          originalRequest.headers['Authorization'] = `Bearer ${this.token}`;
          
          return this.client(originalRequest);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async authenticate(): Promise<void> {
    try {
      const username = process.env.PDDIKTI_USERNAME;
      const password = process.env.PDDIKTI_PASSWORD;
      
      if (!username || !password) {
        throw new Error('PDDikti credentials not provided');
      }
      
      const response = await this.client.post('/login', {
        username,
        password
      });
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        
        // Set token expiry (assume 1 hour validity)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 1);
        this.tokenExpiry = expiryTime;
      } else {
        throw new Error('Authentication failed: No token received');
      }
    } catch (error) {
      console.error('PDDikti authentication error:', error);
      throw new Error('Failed to authenticate with PDDikti');
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    const now = new Date();
    
    // If token doesn't exist or is about to expire (within 5 minutes), get a new one
    if (!this.token || !this.tokenExpiry || (this.tokenExpiry.getTime() - now.getTime() < 5 * 60 * 1000)) {
      await this.authenticate();
    }
  }

  async fetchStudents(params: { page?: number, limit?: number } = {}): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.get('/students', {
        params,
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching students from PDDikti:', error);
      throw new Error('Failed to fetch students from PDDikti');
    }
  }

  async fetchLecturers(params: { page?: number, limit?: number } = {}): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.get('/lecturers', {
        params,
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching lecturers from PDDikti:', error);
      throw new Error('Failed to fetch lecturers from PDDikti');
    }
  }

  async fetchCourses(params: { page?: number, limit?: number } = {}): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.get('/courses', {
        params,
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching courses from PDDikti:', error);
      throw new Error('Failed to fetch courses from PDDikti');
    }
  }

  async fetchStudyPrograms(params: { page?: number, limit?: number } = {}): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.get('/study-programs', {
        params,
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching study programs from PDDikti:', error);
      throw new Error('Failed to fetch study programs from PDDikti');
    }
  }

  async pushStudent(studentData: any): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.post('/students', studentData, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error pushing student to PDDikti:', error);
      throw new Error('Failed to push student to PDDikti');
    }
  }

  async pushLecturer(lecturerData: any): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.post('/lecturers', lecturerData, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error pushing lecturer to PDDikti:', error);
      throw new Error('Failed to push lecturer to PDDikti');
    }
  }

  async pushCourse(courseData: any): Promise<any> {
    await this.ensureAuthenticated();
    
    try {
      const response = await this.client.post('/courses', courseData, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error pushing course to PDDikti:', error);
      throw new Error('Failed to push course to PDDikti');
    }
  }

  async syncStudents(): Promise<any> {
    // Create sync log entry
    const syncLog = await storage.createSyncLog({
      syncType: 'students',
      startTime: new Date(),
      status: 'in_progress'
    });

    try {
      let page = 1;
      const limit = 100;
      let totalProcessed = 0;
      let totalSuccess = 0;
      let totalFailed = 0;
      const errors: any[] = [];

      let hasMoreData = true;

      while (hasMoreData) {
        // Fetch students from PDDikti
        const response = await this.fetchStudents({ page, limit });
        const pddiktiStudents = response.data || [];

        if (pddiktiStudents.length === 0) {
          hasMoreData = false;
          continue;
        }

        // Process each student
        for (const pddiktiStudent of pddiktiStudents) {
          totalProcessed++;

          try {
            // Check if student exists locally
            const existingStudent = await storage.getStudentByPddiktiId(pddiktiStudent.id);

            if (existingStudent) {
              // Update existing student
              await storage.updateStudent(existingStudent.id, {
                // Map PDDikti fields to local fields
                ...existingStudent,
                pddiktiId: pddiktiStudent.id,
                studentId: pddiktiStudent.nim,
                status: pddiktiStudent.status,
                // Add other fields to update
              });
            } else {
              // Create new student
              // First, create or get user
              const user = await storage.createUser({
                username: pddiktiStudent.nim,
                password: await storage.generateRandomPassword(), // You need to implement this
                fullName: pddiktiStudent.name,
                email: pddiktiStudent.email || `${pddiktiStudent.nim}@example.com`,
                role: 'student'
              });

              // Get study program
              let studyProgramId: number;
              const studyProgram = await storage.getStudyProgramByCode(pddiktiStudent.study_program_code);
              
              if (studyProgram) {
                studyProgramId = studyProgram.id;
              } else {
                // Create study program if it doesn't exist
                // This requires additional PDDikti API calls to get study program details
                throw new Error(`Study program with code ${pddiktiStudent.study_program_code} not found`);
              }

              // Create student
              await storage.createStudent({
                userId: user.id,
                studentId: pddiktiStudent.nim,
                studyProgramId,
                entranceYear: parseInt(pddiktiStudent.entrance_year),
                status: pddiktiStudent.status,
                gender: pddiktiStudent.gender,
                birthDate: pddiktiStudent.birth_date ? new Date(pddiktiStudent.birth_date) : undefined,
                birthPlace: pddiktiStudent.birth_place,
                nik: pddiktiStudent.nik,
                pddiktiId: pddiktiStudent.id
              });
            }

            totalSuccess++;
          } catch (error) {
            totalFailed++;
            errors.push({
              studentId: pddiktiStudent.id,
              error: (error as Error).message
            });
          }
        }

        page++;
      }

      // Update sync log
      await storage.updateSyncLog(syncLog.id, {
        status: 'completed',
        endTime: new Date(),
        itemsProcessed: totalProcessed,
        itemsSuccessful: totalSuccess,
        itemsFailed: totalFailed,
        errors: errors.length > 0 ? errors : null
      });

      return {
        id: syncLog.id,
        status: 'completed',
        totalProcessed,
        totalSuccess,
        totalFailed,
        errors
      };
    } catch (error) {
      // Update sync log with error
      await storage.updateSyncLog(syncLog.id, {
        status: 'failed',
        endTime: new Date(),
        errors: [{ error: (error as Error).message }]
      });

      throw error;
    }
  }

  async syncLecturers(): Promise<any> {
    // Similar implementation as syncStudents but for lecturers
    const syncLog = await storage.createSyncLog({
      syncType: 'lecturers',
      startTime: new Date(),
      status: 'in_progress'
    });

    try {
      // Implementation similar to syncStudents
      // ...
      
      await storage.updateSyncLog(syncLog.id, {
        status: 'completed',
        endTime: new Date(),
        itemsProcessed: 0, // Update with actual value
        itemsSuccessful: 0, // Update with actual value
        itemsFailed: 0 // Update with actual value
      });

      return {
        id: syncLog.id,
        status: 'completed'
      };
    } catch (error) {
      await storage.updateSyncLog(syncLog.id, {
        status: 'failed',
        endTime: new Date(),
        errors: [{ error: (error as Error).message }]
      });

      throw error;
    }
  }

  async syncCourses(): Promise<any> {
    // Similar implementation as syncStudents but for courses
    const syncLog = await storage.createSyncLog({
      syncType: 'courses',
      startTime: new Date(),
      status: 'in_progress'
    });

    try {
      // Implementation similar to syncStudents
      // ...
      
      await storage.updateSyncLog(syncLog.id, {
        status: 'completed',
        endTime: new Date(),
        itemsProcessed: 0, // Update with actual value
        itemsSuccessful: 0, // Update with actual value
        itemsFailed: 0 // Update with actual value
      });

      return {
        id: syncLog.id,
        status: 'completed'
      };
    } catch (error) {
      await storage.updateSyncLog(syncLog.id, {
        status: 'failed',
        endTime: new Date(),
        errors: [{ error: (error as Error).message }]
      });

      throw error;
    }
  }

  async getLatestSyncStatus(): Promise<any> {
    try {
      const [studentSync] = await db.select().from(syncLogs)
        .where(eq(syncLogs.syncType, 'students'))
        .orderBy(syncLogs.startTime, 'desc')
        .limit(1);

      const [lecturerSync] = await db.select().from(syncLogs)
        .where(eq(syncLogs.syncType, 'lecturers'))
        .orderBy(syncLogs.startTime, 'desc')
        .limit(1);

      const [courseSync] = await db.select().from(syncLogs)
        .where(eq(syncLogs.syncType, 'courses'))
        .orderBy(syncLogs.startTime, 'desc')
        .limit(1);

      return {
        students: studentSync || { status: 'never_synced' },
        lecturers: lecturerSync || { status: 'never_synced' },
        courses: courseSync || { status: 'never_synced' },
        lastSync: studentSync || lecturerSync || courseSync
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      throw new Error('Failed to get sync status');
    }
  }
}

export const pddiktiClient = new PDDiktiClient();
