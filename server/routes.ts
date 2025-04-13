import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { pddiktiClient } from "./pddikti";
import { eq, like, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  insertStudentSchema,
  insertLecturerSchema,
  insertCourseSchema,
  insertEnrollmentSchema,
  insertAttendanceRecordSchema,
  insertStudentAttendanceSchema,
  insertTransactionSchema,
  insertDocumentSchema,
  students,
  lecturers,
  courses,
  courseOfferings,
  courseSections,
  sectionLecturers,
  enrollments,
  studyPrograms,
  faculties,
  departments,
  semesters,
  users,
  studentAttendance,
  attendanceRecords,
  transactions,
  accounts,
  documents,
  syncLogs
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User management
  app.get("/api/users", async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const role = req.query.role as string;
      
      const offset = (page - 1) * limit;
      
      let query = db.select().from(users);
      
      if (search) {
        query = query.where(
          like(users.fullName, `%${search}%`)
        );
      }
      
      if (role) {
        query = query.where(eq(users.role, role));
      }
      
      const data = await query.limit(limit).offset(offset);
      
      // Don't send passwords
      const safeData = data.map(user => {
        const { password, ...rest } = user;
        return rest;
      });
      
      const [countResult] = await db.select({ count: db.count() }).from(users);
      const totalCount = Number(countResult?.count || 0);
      
      res.json({
        data: safeData,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Get active semester
  app.get("/api/active-semester", async (req, res, next) => {
    try {
      const activeSemester = await storage.getActiveSemester();
      if (!activeSemester) {
        return res.status(404).json({ message: "No active semester found" });
      }
      res.json(activeSemester);
    } catch (error) {
      next(error);
    }
  });

  // Student management
  app.get("/api/students", async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const studyProgramId = req.query.studyProgramId as string;
      const status = req.query.status as string;
      
      const offset = (page - 1) * limit;
      
      let query = db.select({
        student: students,
        user: users,
        studyProgram: studyPrograms
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(studyPrograms, eq(students.studyProgramId, studyPrograms.id));
      
      const conditions = [];
      
      if (search) {
        conditions.push(
          like(users.fullName, `%${search}%`)
        );
      }
      
      if (studyProgramId) {
        conditions.push(
          eq(students.studyProgramId, parseInt(studyProgramId))
        );
      }
      
      if (status) {
        conditions.push(
          eq(students.status, status)
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const data = await query.limit(limit).offset(offset);
      
      // Clean data by removing user passwords
      const cleanData = data.map(item => {
        const { password, ...userWithoutPassword } = item.user;
        return {
          ...item,
          user: userWithoutPassword
        };
      });
      
      const [countResult] = await db.select({ count: db.count() }).from(students);
      const totalCount = Number(countResult?.count || 0);
      
      res.json({
        data: cleanData,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/students", async (req, res, next) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/students/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Get related data
      const user = await storage.getUser(student.userId);
      const studyProgram = await storage.getStudyProgram(student.studyProgramId);
      
      if (!user || !studyProgram) {
        return res.status(404).json({ message: "Related data not found" });
      }
      
      // Remove password
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        ...student,
        user: userWithoutPassword,
        studyProgram
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/students/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const existingStudent = await storage.getStudent(id);
      
      if (!existingStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const studentData = insertStudentSchema.parse(req.body);
      const updatedStudent = await storage.updateStudent(id, studentData);
      res.json(updatedStudent);
    } catch (error) {
      next(error);
    }
  });

  // Lecturer management
  app.get("/api/lecturers", async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const departmentId = req.query.departmentId as string;
      
      const offset = (page - 1) * limit;
      
      let query = db.select({
        lecturer: lecturers,
        user: users,
        department: departments
      })
      .from(lecturers)
      .leftJoin(users, eq(lecturers.userId, users.id))
      .leftJoin(departments, eq(lecturers.departmentId, departments.id));
      
      const conditions = [];
      
      if (search) {
        conditions.push(
          like(users.fullName, `%${search}%`)
        );
      }
      
      if (departmentId) {
        conditions.push(
          eq(lecturers.departmentId, parseInt(departmentId))
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const data = await query.limit(limit).offset(offset);
      
      // Clean data by removing user passwords
      const cleanData = data.map(item => {
        const { password, ...userWithoutPassword } = item.user;
        return {
          ...item,
          user: userWithoutPassword
        };
      });
      
      const [countResult] = await db.select({ count: db.count() }).from(lecturers);
      const totalCount = Number(countResult?.count || 0);
      
      res.json({
        data: cleanData,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/lecturers", async (req, res, next) => {
    try {
      const lecturerData = insertLecturerSchema.parse(req.body);
      const lecturer = await storage.createLecturer(lecturerData);
      res.status(201).json(lecturer);
    } catch (error) {
      next(error);
    }
  });

  // Course management
  app.get("/api/courses", async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const studyProgramId = req.query.studyProgramId as string;
      
      const offset = (page - 1) * limit;
      
      let query = db.select({
        course: courses,
        studyProgram: studyPrograms
      })
      .from(courses)
      .leftJoin(studyPrograms, eq(courses.studyProgramId, studyPrograms.id));
      
      const conditions = [];
      
      if (search) {
        conditions.push(
          like(courses.name, `%${search}%`)
        );
      }
      
      if (studyProgramId) {
        conditions.push(
          eq(courses.studyProgramId, parseInt(studyProgramId))
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const data = await query.limit(limit).offset(offset);
      
      const [countResult] = await db.select({ count: db.count() }).from(courses);
      const totalCount = Number(countResult?.count || 0);
      
      res.json({
        data,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/courses", async (req, res, next) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  });

  // Course offerings per semester
  app.get("/api/course-offerings", async (req, res, next) => {
    try {
      const semesterId = req.query.semesterId as string;
      
      if (!semesterId) {
        return res.status(400).json({ message: "Semester ID is required" });
      }
      
      const offerings = await db.select({
        offering: courseOfferings,
        course: courses,
        semester: semesters
      })
      .from(courseOfferings)
      .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
      .leftJoin(semesters, eq(courseOfferings.semesterId, semesters.id))
      .where(eq(courseOfferings.semesterId, parseInt(semesterId)));
      
      res.json(offerings);
    } catch (error) {
      next(error);
    }
  });

  // Enrollments
  app.get("/api/enrollments", async (req, res, next) => {
    try {
      const studentId = req.query.studentId as string;
      const sectionId = req.query.sectionId as string;
      
      let query = db.select({
        enrollment: enrollments,
        student: students,
        section: courseSections
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(courseSections, eq(enrollments.sectionId, courseSections.id));
      
      const conditions = [];
      
      if (studentId) {
        conditions.push(eq(enrollments.studentId, parseInt(studentId)));
      }
      
      if (sectionId) {
        conditions.push(eq(enrollments.sectionId, parseInt(sectionId)));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const data = await query;
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/enrollments", async (req, res, next) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  });

  // Attendance
  app.get("/api/attendance-records", async (req, res, next) => {
    try {
      const sectionId = req.query.sectionId as string;
      
      if (!sectionId) {
        return res.status(400).json({ message: "Section ID is required" });
      }
      
      const records = await db.select().from(attendanceRecords)
        .where(eq(attendanceRecords.sectionId, parseInt(sectionId)))
        .orderBy(desc(attendanceRecords.date));
      
      res.json(records);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/attendance-records", async (req, res, next) => {
    try {
      const recordData = insertAttendanceRecordSchema.parse(req.body);
      const record = await storage.createAttendanceRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/student-attendance", async (req, res, next) => {
    try {
      const attendanceRecordId = req.query.attendanceRecordId as string;
      const studentId = req.query.studentId as string;
      
      let query = db.select().from(studentAttendance);
      
      const conditions = [];
      
      if (attendanceRecordId) {
        conditions.push(eq(studentAttendance.attendanceRecordId, parseInt(attendanceRecordId)));
      }
      
      if (studentId) {
        conditions.push(eq(studentAttendance.studentId, parseInt(studentId)));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const data = await query;
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/student-attendance", async (req, res, next) => {
    try {
      const attendanceData = insertStudentAttendanceSchema.parse(req.body);
      const attendance = await storage.createStudentAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      next(error);
    }
  });

  // Financial
  app.get("/api/accounts", async (req, res, next) => {
    try {
      const studentId = req.query.studentId as string;
      
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }
      
      const [account] = await db.select().from(accounts)
        .where(eq(accounts.studentId, parseInt(studentId)));
      
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/transactions", async (req, res, next) => {
    try {
      const accountId = req.query.accountId as string;
      
      if (!accountId) {
        return res.status(400).json({ message: "Account ID is required" });
      }
      
      const transactions = await db.select().from(transactions)
        .where(eq(transactions.accountId, parseInt(accountId)))
        .orderBy(desc(transactions.transactionDate));
      
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/transactions", async (req, res, next) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  });

  // Documents
  app.get("/api/documents", async (req, res, next) => {
    try {
      const studentId = req.query.studentId as string;
      
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }
      
      const docs = await db.select().from(documents)
        .where(eq(documents.studentId, parseInt(studentId)));
      
      res.json(docs);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/documents", async (req, res, next) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  });

  // Study program management
  app.get("/api/study-programs", async (req, res, next) => {
    try {
      const departmentId = req.query.departmentId as string;
      
      let query = db.select().from(studyPrograms);
      
      if (departmentId) {
        query = query.where(eq(studyPrograms.departmentId, parseInt(departmentId)));
      }
      
      const data = await query;
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  // Department management
  app.get("/api/departments", async (req, res, next) => {
    try {
      const facultyId = req.query.facultyId as string;
      
      let query = db.select().from(departments);
      
      if (facultyId) {
        query = query.where(eq(departments.facultyId, parseInt(facultyId)));
      }
      
      const data = await query;
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  // Faculty management
  app.get("/api/faculties", async (req, res, next) => {
    try {
      const data = await db.select().from(faculties);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  // Semester management
  app.get("/api/semesters", async (req, res, next) => {
    try {
      const data = await db.select().from(semesters)
        .orderBy(desc(semesters.academicYear), desc(semesters.name));
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  // PDDikti Integration
  app.get("/api/pddikti/status", async (req, res, next) => {
    try {
      const status = await pddiktiClient.getLatestSyncStatus();
      res.json(status);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pddikti/sync", async (req, res, next) => {
    try {
      const { entity } = req.body;
      
      if (!entity) {
        return res.status(400).json({ message: "Entity type is required" });
      }
      
      let result;
      
      switch (entity) {
        case 'students':
          result = await pddiktiClient.syncStudents();
          break;
        case 'lecturers':
          result = await pddiktiClient.syncLecturers();
          break;
        case 'courses':
          result = await pddiktiClient.syncCourses();
          break;
        default:
          return res.status(400).json({ message: `Invalid entity type: ${entity}` });
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pddikti/sync-logs", async (req, res, next) => {
    try {
      const syncType = req.query.syncType as string;
      
      let query = db.select().from(syncLogs)
        .orderBy(desc(syncLogs.startTime));
      
      if (syncType) {
        query = query.where(eq(syncLogs.syncType, syncType));
      }
      
      const logs = await query.limit(10);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  // Dashboards
  app.get("/api/dashboard/stats", async (req, res, next) => {
    try {
      const [studentsCount] = await db.select({ count: db.count() }).from(students);
      const [lecturersCount] = await db.select({ count: db.count() }).from(lecturers);
      const [coursesCount] = await db.select({ count: db.count() }).from(courses);
      
      // Get active semester
      const activeSemester = await storage.getActiveSemester();
      
      // Get active courses for the active semester
      const activeCourses = activeSemester 
        ? await db.select({ count: db.count() }).from(courseOfferings)
            .where(eq(courseOfferings.semesterId, activeSemester.id))
        : [{ count: 0 }];
      
      // Get PDDikti sync status
      const pddiktiStatus = await pddiktiClient.getLatestSyncStatus();
      
      res.json({
        totalStudents: Number(studentsCount?.count || 0),
        totalLecturers: Number(lecturersCount?.count || 0),
        totalCourses: Number(coursesCount?.count || 0),
        activeCourses: Number(activeCourses[0]?.count || 0),
        activeSemester,
        pddiktiStatus: pddiktiStatus.lastSync
          ? {
              status: pddiktiStatus.lastSync.status,
              lastSync: pddiktiStatus.lastSync.endTime || pddiktiStatus.lastSync.startTime
            }
          : { status: 'never_synced' }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/dashboard/recent-activities", async (req, res, next) => {
    try {
      // Combine recent activities
      // Recent enrollments
      const recentEnrollments = await db.select({
        enrollment: enrollments,
        student: {
          id: students.id,
          studentId: students.studentId,
          name: users.fullName
        }
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .orderBy(desc(enrollments.enrollmentDate))
      .limit(5);
      
      // Recent sync logs
      const recentSyncs = await db.select()
      .from(syncLogs)
      .orderBy(desc(syncLogs.startTime))
      .limit(5);
      
      // Combine and map to activity format
      const activities = [
        ...recentEnrollments.map(item => ({
          type: 'enrollment',
          title: 'Pendaftaran mata kuliah',
          description: `${item.student.name} (${item.student.studentId}) mendaftar mata kuliah`,
          timestamp: item.enrollment.enrollmentDate,
          icon: 'user-add'
        })),
        ...recentSyncs.map(item => ({
          type: 'sync',
          title: `Sinkronisasi ${item.syncType}`,
          description: `Status: ${item.status}`,
          timestamp: item.endTime || item.startTime,
          icon: item.status === 'completed' ? 'database-2' : 'error-warning'
        }))
      ].sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }).slice(0, 5);
      
      res.json(activities);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
