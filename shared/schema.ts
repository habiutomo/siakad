import { pgTable, text, serial, integer, boolean, timestamp, jsonb, customType, uniqueIndex, varchar, foreignKey, time, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Role Enum
export const userRoles = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
  STAFF: "staff",
} as const;

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: Object.values(userRoles) }).notNull().default(userRoles.STUDENT),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastSyncAt: timestamp("last_sync_at"),
  pddiktiId: text("pddikti_id"),
});

// Faculty model
export const faculties = pgTable("faculties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Department model
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  facultyId: integer("faculty_id").notNull().references(() => faculties.id),
  description: text("description"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Study Program model
export const studyPrograms = pgTable("study_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  degree: text("degree").notNull(), // Bachelor, Master, etc.
  accreditation: text("accreditation"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student model
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  studentId: text("student_id").notNull().unique(), // Student ID (NIM)
  studyProgramId: integer("study_program_id").notNull().references(() => studyPrograms.id),
  entranceYear: integer("entrance_year").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, on_leave, graduated
  gender: text("gender"),
  birthDate: date("birth_date"),
  birthPlace: text("birth_place"),
  nik: text("nik"), // National ID number
  familyCardNumber: text("family_card_number"),
  parentName: text("parent_name"),
  parentPhone: text("parent_phone"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lecturer (Faculty) model
export const lecturers = pgTable("lecturers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lecturerId: text("lecturer_id").notNull().unique(), // Lecturer ID (NIDN)
  departmentId: integer("department_id").notNull().references(() => departments.id),
  position: text("position"), // Professor, Associate Professor, etc.
  employmentStatus: text("employment_status").notNull(), // Full-time, Part-time
  educationLevel: text("education_level"), // S1, S2, S3
  expertise: text("expertise"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Semester model
export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "Fall 2023", "Spring 2024"
  academicYear: text("academic_year").notNull(), // e.g., "2023/2024"
  type: text("type").notNull(), // odd, even
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  registrationStartDate: date("registration_start_date"),
  registrationEndDate: date("registration_end_date"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(), // SKS
  studyProgramId: integer("study_program_id").notNull().references(() => studyPrograms.id),
  semester: integer("semester").notNull(), // 1-8 for Bachelor
  type: text("type").notNull().default("mandatory"), // mandatory, elective
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course Offerings for specific semesters
export const courseOfferings = pgTable("course_offerings", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  semesterId: integer("semester_id").notNull().references(() => semesters.id),
  lectureHours: integer("lecture_hours").notNull(),
  labHours: integer("lab_hours").notNull().default(0),
  maxStudents: integer("max_students"),
  currentStudents: integer("current_students").notNull().default(0),
  status: text("status").notNull().default("active"), // active, canceled, completed
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course Sections (Classes)
export const courseSections = pgTable("course_sections", {
  id: serial("id").primaryKey(),
  courseOfferingId: integer("course_offering_id").notNull().references(() => courseOfferings.id),
  sectionCode: text("section_code").notNull(), // A, B, C, etc.
  lectureLocation: text("lecture_location"),
  labLocation: text("lab_location"),
  maxStudents: integer("max_students"),
  currentStudents: integer("current_students").notNull().default(0),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course Section Lecturers (teaching assignments)
export const sectionLecturers = pgTable("section_lecturers", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => courseSections.id),
  lecturerId: integer("lecturer_id").notNull().references(() => lecturers.id),
  isCoordinator: boolean("is_coordinator").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course Schedules
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => courseSections.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  roomId: integer("room_id").references(() => rooms.id),
  scheduleType: text("schedule_type").notNull().default("lecture"), // lecture, lab, exam
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Rooms
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  buildingName: text("building_name").notNull(),
  roomNumber: text("room_number").notNull(),
  capacity: integer("capacity").notNull(),
  roomType: text("room_type").notNull(), // classroom, lab, office
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student Course Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  sectionId: integer("section_id").notNull().references(() => courseSections.id),
  enrollmentDate: timestamp("enrollment_date").notNull().defaultNow(),
  status: text("status").notNull().default("enrolled"), // enrolled, withdrawn, completed
  grade: text("grade"), // A, B, C, D, E or numeric
  gradePoints: integer("grade_points"),
  finalScore: integer("final_score"),
  midtermScore: integer("midterm_score"),
  assignmentScore: integer("assignment_score"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Attendance Records
export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => courseSections.id),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student Attendance
export const studentAttendance = pgTable("student_attendance", {
  id: serial("id").primaryKey(),
  attendanceRecordId: integer("attendance_record_id").notNull().references(() => attendanceRecords.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  status: text("status").notNull(), // present, absent, excused, late
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Financial Accounts
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  balance: integer("balance").notNull().default(0),
  lastPaymentDate: timestamp("last_payment_date"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Financial Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // payment, charge, refund
  description: text("description").notNull(),
  paymentMethod: text("payment_method"),
  referenceNumber: text("reference_number"),
  pddiktiId: text("pddikti_id"),
  transactionDate: timestamp("transaction_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// PDDikti sync records
export const syncLogs = pgTable("sync_logs", {
  id: serial("id").primaryKey(),
  syncType: text("sync_type").notNull(), // students, lecturers, courses, etc.
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, failed
  itemsProcessed: integer("items_processed").notNull().default(0),
  itemsSuccessful: integer("items_successful").notNull().default(0),
  itemsFailed: integer("items_failed").notNull().default(0),
  errors: jsonb("errors"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  documentType: text("document_type").notNull(), // transcript, certificate, id_card, etc.
  documentNumber: text("document_number"),
  issueDate: date("issue_date"),
  expiryDate: date("expiry_date"),
  status: text("status").notNull().default("active"), // active, expired, revoked
  description: text("description"),
  documentUrl: text("document_url"),
  pddiktiId: text("pddikti_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncAt: true
});

export const insertFacultySchema = createInsertSchema(faculties).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertStudyProgramSchema = createInsertSchema(studyPrograms).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertStudentSchema = createInsertSchema(students).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertLecturerSchema = createInsertSchema(lecturers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertSemesterSchema = createInsertSchema(semesters).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCourseSchema = createInsertSchema(courses).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCourseOfferingSchema = createInsertSchema(courseOfferings).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  currentStudents: true
});

export const insertCourseSectionSchema = createInsertSchema(courseSections).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  currentStudents: true
});

export const insertSectionLecturerSchema = createInsertSchema(sectionLecturers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertRoomSchema = createInsertSchema(rooms).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ 
  id: true,
  enrollmentDate: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertStudentAttendanceSchema = createInsertSchema(studentAttendance).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ 
  id: true, 
  balance: true,
  lastPaymentDate: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  transactionDate: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertSyncLogSchema = createInsertSchema(syncLogs).omit({ 
  id: true, 
  itemsProcessed: true,
  itemsSuccessful: true,
  itemsFailed: true,
  endTime: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type Faculty = typeof faculties.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export type InsertStudyProgram = z.infer<typeof insertStudyProgramSchema>;
export type StudyProgram = typeof studyPrograms.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertLecturer = z.infer<typeof insertLecturerSchema>;
export type Lecturer = typeof lecturers.$inferSelect;

export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type Semester = typeof semesters.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertCourseOffering = z.infer<typeof insertCourseOfferingSchema>;
export type CourseOffering = typeof courseOfferings.$inferSelect;

export type InsertCourseSection = z.infer<typeof insertCourseSectionSchema>;
export type CourseSection = typeof courseSections.$inferSelect;

export type InsertSectionLecturer = z.infer<typeof insertSectionLecturerSchema>;
export type SectionLecturer = typeof sectionLecturers.$inferSelect;

export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export type InsertStudentAttendance = z.infer<typeof insertStudentAttendanceSchema>;
export type StudentAttendance = typeof studentAttendance.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertSyncLog = z.infer<typeof insertSyncLogSchema>;
export type SyncLog = typeof syncLogs.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
