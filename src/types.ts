export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type DayOfWeek = "Thứ Hai" | "Thứ Ba" | "Thứ Tư" | "Thứ Năm" | "Thứ Sáu";

export type SessionType = "Sáng" | "Chiều";

export interface TeacherInfo {
  id: string;
  name: string;
  shortName: string;
  role: string; // e.g. "GVCN 5A", "GV Chuyên Tiếng Anh", "GV Chuyên Âm nhạc"
  subjectSpecialty?: string; // "Tiếng Anh", "Mĩ thuật", "Âm nhạc", "GDTC", "Tin học", "Chủ nhiệm"
  isSpecialist: boolean; // True for GV chuyên môn, False for GVCN
  assignedClass?: string; // "5A"
}

export interface SchoolProfile {
  districtDepartment: string; // "PHÒNG GD&ĐT HUYỆN TÂN THẠNH" or "UBND XÃ TÂN THẠNH"
  schoolName: string; // "TRƯỜNG TIỂU HỌC TÂN THẠNH"
  branchName: string; // "Phân hiệu 1" (or empty)
  teacherName: string; // "Nguyễn Hoàng Tuấn"
  className: string; // "5A"
  grade: GradeLevel; // 5
  departmentGroup: string; // "TỔ CHUYÊN MÔN KHỐI 5"
  schoolYear: string; // "2025 - 2026"
  currentWeek: number; // 1
  weekStartDate: string; // "08/09/2025"
  weekEndDate: string; // "12/09/2025"
  fontSize: 12 | 13 | 14;
}

export interface TimetableCell {
  subject: string;
  teacher: string;
  isSpecialist?: boolean;
}

export interface TimetableSlot {
  day: DayOfWeek;
  session: SessionType;
  period: number; // 1 to 5 for Sáng, 1 to 3 for Chiều
  assignments: Record<string, TimetableCell>; // classId -> { subject, teacher }
}

export interface IntegratedTag {
  id: string;
  type: "NLS" | "AI" | "QCN" | "QPAN" | "GDDD" | "BVMT" | "KNS" | "STEM" | "HTQC" | "GDDP" | "ATGT" | "KHAC";
  code?: string; // e.g. "NLS 1.1.CB1a", "AI YCCĐ 2.A1.1", "GDQPAN"
  title: string;
  description: string;
  targetActivity?: string; // "Hoạt động 1", "Hoạt động 2", "Hoạt động 3", "Hoạt động 4"
}

export interface TeachingActivity {
  step: number;
  title: string; // "1. Khởi động", "2. Khám phá", "3. Luyện tập / Thực hành", "4. Vận dụng / Trải nghiệm"
  objective: string;
  time?: string;
  teacherActivity: string;
  studentActivity: string;
}

export type LessonActivity = TeachingActivity;

export interface LessonPlan {
  id: string;
  grade: GradeLevel;
  subject: string;
  topic?: string;
  lessonTitle: string;
  period: string; // e.g. "Tiết 1", "Tiết 1 - PPCT 1"
  ppctNumber?: number | string;
  week: number;
  dayOfWeek: DayOfWeek;
  session?: SessionType;
  periodInDay?: number;
  teacherName?: string;
  className?: string;
  objectives: {
    specificCompetencies: string[]; // Năng lực đặc thù
    generalCompetencies: string[]; // Năng lực chung (tự chủ, giao tiếp, sáng tạo)
    qualities: string[]; // Phẩm chất (nhân ái, chăm chỉ, trách nhiệm, trung thực, yêu nước)
  };
  integratedContent?: string; // Text summary of integrations
  integrationTags?: IntegratedTag[];
  integratedTags?: string[];
  equipment: {
    teacher: string;
    students: string;
  };
  activities: TeachingActivity[];
  adjustment?: string; // Điều chỉnh sau bài dạy
  isSpecialist?: boolean;
  specialistTeacherName?: string;
}

export interface TeachingScheduleEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  dateStr: string; // "08/09"
  session: SessionType;
  periodInDay: number; // 1 - 7
  subject: string;
  ppct: string | number;
  lessonTitle: string;
  integrationNote: string;
  isSpecialistPeriod?: boolean;
  specialistTeacherName?: string;
  lessonPlanId?: string;
}

export interface QuizOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: QuizOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface EssayExercise {
  id: string;
  exerciseNumber: number;
  title: string;
  prompt: string;
  solution: string;
}

export interface WeeklyWorksheet {
  id: string;
  grade: GradeLevel;
  week: number;
  subject: string;
  title: string;
  bookSeries: string;
  loigiaihayUrl: string;
  sourceLabel: string;
  questions: QuizQuestion[];
  essayExercises: EssayExercise[];
}
