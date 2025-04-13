import { 
  users, type User, type InsertUser, 
  students, type Student, type InsertStudent,
  lecturers, type Lecturer, type InsertLecturer,
  courses, type Course, type InsertCourse,
  faculties, type Faculty, type InsertFaculty,
  departments, type Department, type InsertDepartment,
  studyPrograms, type StudyProgram, type InsertStudyProgram,
  semesters, type Semester, type InsertSemester,
  courseOfferings, type CourseOffering, type InsertCourseOffering,
  courseSections, type CourseSection, type InsertCourseSection,
  sectionLecturers, type SectionLecturer, type InsertSectionLecturer,
  schedules, type Schedule, type InsertSchedule,
  rooms, type Room, type InsertRoom,
  enrollments, type Enrollment, type InsertEnrollment,
  attendanceRecords, type AttendanceRecord, type InsertAttendanceRecord,
  studentAttendance, type StudentAttendance, type InsertStudentAttendance,
  accounts, type Account, type InsertAccount,
  transactions, type Transaction, type InsertTransaction,
  documents, type Document, type InsertDocument,
  syncLogs, type SyncLog, type InsertSyncLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomBytes } from "crypto";
import connectPg from "connect-pg-simple";
import session from "express-session";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Student management
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  getStudentByPddiktiId(pddiktiId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student>;
  
  // Lecturer management
  getLecturer(id: number): Promise<Lecturer | undefined>;
  getLecturerByUserId(userId: number): Promise<Lecturer | undefined>;
  getLecturerByLecturerId(lecturerId: string): Promise<Lecturer | undefined>;
  getLecturerByPddiktiId(pddiktiId: string): Promise<Lecturer | undefined>;
  createLecturer(lecturer: InsertLecturer): Promise<Lecturer>;
  updateLecturer(id: number, lecturer: Partial<InsertLecturer>): Promise<Lecturer>;

  // Course management
  getCourse(id: number): Promise<Course | undefined>;
  getCourseByCode(code: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  
  // Faculty management
  getFaculty(id: number): Promise<Faculty | undefined>;
  getFacultyByCode(code: string): Promise<Faculty | undefined>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  
  // Department management
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartmentByCode(code: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Study Program management
  getStudyProgram(id: number): Promise<StudyProgram | undefined>;
  getStudyProgramByCode(code: string): Promise<StudyProgram | undefined>;
  createStudyProgram(studyProgram: InsertStudyProgram): Promise<StudyProgram>;
  
  // Semester management
  getSemester(id: number): Promise<Semester | undefined>;
  getActiveSemester(): Promise<Semester | undefined>;
  createSemester(semester: InsertSemester): Promise<Semester>;
  updateSemester(id: number, semester: Partial<InsertSemester>): Promise<Semester>;
  
  // Course Offering management
  getCourseOffering(id: number): Promise<CourseOffering | undefined>;
  createCourseOffering(offering: InsertCourseOffering): Promise<CourseOffering>;
  
  // Course Section management
  getCourseSection(id: number): Promise<CourseSection | undefined>;
  createCourseSection(section: InsertCourseSection): Promise<CourseSection>;
  
  // Section Lecturer management
  createSectionLecturer(sectionLecturer: InsertSectionLecturer): Promise<SectionLecturer>;
  
  // Schedule management
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  
  // Room management
  createRoom(room: InsertRoom): Promise<Room>;
  
  // Enrollment management
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Attendance management
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  createStudentAttendance(attendance: InsertStudentAttendance): Promise<StudentAttendance>;
  
  // Account management
  createAccount(account: InsertAccount): Promise<Account>;
  
  // Transaction management
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Document management
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Sync Log management
  createSyncLog(log: InsertSyncLog): Promise<SyncLog>;
  updateSyncLog(id: number, log: Partial<SyncLog>): Promise<SyncLog>;
  
  // Utility
  generateRandomPassword(): Promise<string>;
  
  // Session store
  sessionStore: session.SessionStore;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: db.driver,
      createTableIfMissing: true
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Student management
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.studentId, studentId));
    return student;
  }

  async getStudentByPddiktiId(pddiktiId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.pddiktiId, pddiktiId));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async updateStudent(id: number, studentData: Partial<InsertStudent>): Promise<Student> {
    const [updatedStudent] = await db
      .update(students)
      .set({
        ...studentData,
        updatedAt: new Date()
      })
      .where(eq(students.id, id))
      .returning();
    return updatedStudent;
  }

  // Lecturer management
  async getLecturer(id: number): Promise<Lecturer | undefined> {
    const [lecturer] = await db.select().from(lecturers).where(eq(lecturers.id, id));
    return lecturer;
  }

  async getLecturerByUserId(userId: number): Promise<Lecturer | undefined> {
    const [lecturer] = await db.select().from(lecturers).where(eq(lecturers.userId, userId));
    return lecturer;
  }

  async getLecturerByLecturerId(lecturerId: string): Promise<Lecturer | undefined> {
    const [lecturer] = await db.select().from(lecturers).where(eq(lecturers.lecturerId, lecturerId));
    return lecturer;
  }

  async getLecturerByPddiktiId(pddiktiId: string): Promise<Lecturer | undefined> {
    const [lecturer] = await db.select().from(lecturers).where(eq(lecturers.pddiktiId, pddiktiId));
    return lecturer;
  }

  async createLecturer(lecturer: InsertLecturer): Promise<Lecturer> {
    const [newLecturer] = await db.insert(lecturers).values(lecturer).returning();
    return newLecturer;
  }

  async updateLecturer(id: number, lecturerData: Partial<InsertLecturer>): Promise<Lecturer> {
    const [updatedLecturer] = await db
      .update(lecturers)
      .set({
        ...lecturerData,
        updatedAt: new Date()
      })
      .where(eq(lecturers.id, id))
      .returning();
    return updatedLecturer;
  }

  // Course management
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseByCode(code: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.code, code));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, courseData: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({
        ...courseData,
        updatedAt: new Date()
      })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Faculty management
  async getFaculty(id: number): Promise<Faculty | undefined> {
    const [faculty] = await db.select().from(faculties).where(eq(faculties.id, id));
    return faculty;
  }

  async getFacultyByCode(code: string): Promise<Faculty | undefined> {
    const [faculty] = await db.select().from(faculties).where(eq(faculties.code, code));
    return faculty;
  }

  async createFaculty(faculty: InsertFaculty): Promise<Faculty> {
    const [newFaculty] = await db.insert(faculties).values(faculty).returning();
    return newFaculty;
  }

  // Department management
  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async getDepartmentByCode(code: string): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.code, code));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  // Study Program management
  async getStudyProgram(id: number): Promise<StudyProgram | undefined> {
    const [studyProgram] = await db.select().from(studyPrograms).where(eq(studyPrograms.id, id));
    return studyProgram;
  }

  async getStudyProgramByCode(code: string): Promise<StudyProgram | undefined> {
    const [studyProgram] = await db.select().from(studyPrograms).where(eq(studyPrograms.code, code));
    return studyProgram;
  }

  async createStudyProgram(studyProgram: InsertStudyProgram): Promise<StudyProgram> {
    const [newStudyProgram] = await db.insert(studyPrograms).values(studyProgram).returning();
    return newStudyProgram;
  }

  // Semester management
  async getSemester(id: number): Promise<Semester | undefined> {
    const [semester] = await db.select().from(semesters).where(eq(semesters.id, id));
    return semester;
  }

  async getActiveSemester(): Promise<Semester | undefined> {
    const [activeSemester] = await db.select().from(semesters).where(eq(semesters.isActive, true));
    return activeSemester;
  }

  async createSemester(semester: InsertSemester): Promise<Semester> {
    const [newSemester] = await db.insert(semesters).values(semester).returning();
    return newSemester;
  }

  async updateSemester(id: number, semesterData: Partial<InsertSemester>): Promise<Semester> {
    // If setting as active, deactivate all other semesters first
    if (semesterData.isActive) {
      await db.update(semesters).set({ isActive: false });
    }
    
    const [updatedSemester] = await db
      .update(semesters)
      .set({
        ...semesterData,
        updatedAt: new Date()
      })
      .where(eq(semesters.id, id))
      .returning();
    return updatedSemester;
  }

  // Course Offering management
  async getCourseOffering(id: number): Promise<CourseOffering | undefined> {
    const [offering] = await db.select().from(courseOfferings).where(eq(courseOfferings.id, id));
    return offering;
  }

  async createCourseOffering(offering: InsertCourseOffering): Promise<CourseOffering> {
    const [newOffering] = await db.insert(courseOfferings).values(offering).returning();
    return newOffering;
  }

  // Course Section management
  async getCourseSection(id: number): Promise<CourseSection | undefined> {
    const [section] = await db.select().from(courseSections).where(eq(courseSections.id, id));
    return section;
  }

  async createCourseSection(section: InsertCourseSection): Promise<CourseSection> {
    const [newSection] = await db.insert(courseSections).values(section).returning();
    return newSection;
  }

  // Section Lecturer management
  async createSectionLecturer(sectionLecturer: InsertSectionLecturer): Promise<SectionLecturer> {
    const [newSectionLecturer] = await db.insert(sectionLecturers).values(sectionLecturer).returning();
    return newSectionLecturer;
  }

  // Schedule management
  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  // Room management
  async createRoom(room: InsertRoom): Promise<Room> {
    const [newRoom] = await db.insert(rooms).values(room).returning();
    return newRoom;
  }

  // Enrollment management
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    
    // Update current student count in the section
    const [section] = await db.select().from(courseSections).where(eq(courseSections.id, enrollment.sectionId));
    if (section) {
      await db.update(courseSections)
        .set({ currentStudents: section.currentStudents + 1 })
        .where(eq(courseSections.id, enrollment.sectionId));
    }
    
    return newEnrollment;
  }

  // Attendance management
  async createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const [newRecord] = await db.insert(attendanceRecords).values(record).returning();
    return newRecord;
  }

  async createStudentAttendance(attendance: InsertStudentAttendance): Promise<StudentAttendance> {
    const [newAttendance] = await db.insert(studentAttendance).values(attendance).returning();
    return newAttendance;
  }

  // Account management
  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db.insert(accounts).values(account).returning();
    return newAccount;
  }

  // Transaction management
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values({
      ...transaction,
      transactionDate: new Date()
    }).returning();
    
    // Update account balance
    const [account] = await db.select().from(accounts).where(eq(accounts.id, transaction.accountId));
    if (account) {
      let newBalance = account.balance;
      
      if (transaction.type === 'payment') {
        newBalance += transaction.amount;
      } else if (transaction.type === 'charge') {
        newBalance -= transaction.amount;
      } else if (transaction.type === 'refund') {
        newBalance += transaction.amount;
      }
      
      await db.update(accounts)
        .set({ 
          balance: newBalance,
          lastPaymentDate: transaction.type === 'payment' ? new Date() : account.lastPaymentDate,
          updatedAt: new Date()
        })
        .where(eq(accounts.id, transaction.accountId));
    }
    
    return newTransaction;
  }

  // Document management
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  // Sync Log management
  async createSyncLog(log: InsertSyncLog): Promise<SyncLog> {
    const [newLog] = await db.insert(syncLogs).values(log).returning();
    return newLog;
  }

  async updateSyncLog(id: number, logData: Partial<SyncLog>): Promise<SyncLog> {
    const [updatedLog] = await db
      .update(syncLogs)
      .set({
        ...logData,
        updatedAt: new Date()
      })
      .where(eq(syncLogs.id, id))
      .returning();
    return updatedLog;
  }

  // Utility methods
  async generateRandomPassword(): Promise<string> {
    const length = 12;
    const buffer = randomBytes(Math.ceil(length / 2));
    return buffer.toString('hex').slice(0, length);
  }
}

export const storage = new DatabaseStorage();
