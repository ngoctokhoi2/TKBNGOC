import {
  SchoolProfile,
  TimetableSlot,
  TeachingScheduleEntry,
  LessonPlan,
  TeacherInfo,
  DayOfWeek,
  GradeLevel,
} from "../types";

export const daysOfWeekList: DayOfWeek[] = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
];

export const standardDatesMap: Record<DayOfWeek, string> = {
  "Thứ Hai": "07/09/2026",
  "Thứ Ba": "08/09/2026",
  "Thứ Tư": "09/09/2026",
  "Thứ Năm": "10/09/2026",
  "Thứ Sáu": "11/09/2026",
};

/**
 * Automatically calculate full and short dates for any given week starting from base 07/09/2026 (Tuần 1)
 */
export function calculateWeekDates(weekNumber: number, baseStartDateStr: string = "07/09/2026"): {
  weekStartDate: string;
  weekEndDate: string;
  shortDatesMap: Record<DayOfWeek, string>;
  fullDatesMap: Record<DayOfWeek, string>;
} {
  const parts = (baseStartDateStr || "07/09/2026").split("/").map(Number);
  const baseDay = parts[0] || 7;
  const baseMonth = (parts[1] || 9) - 1;
  const baseYear = parts[2] || 2026;

  const formatDate = (d: Date): string => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatShort = (d: Date): string => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  };

  const dayOffsets: Record<DayOfWeek, number> = {
    "Thứ Hai": 0,
    "Thứ Ba": 1,
    "Thứ Tư": 2,
    "Thứ Năm": 3,
    "Thứ Sáu": 4,
  };

  const fullDatesMap: Record<DayOfWeek, string> = {
    "Thứ Hai": "",
    "Thứ Ba": "",
    "Thứ Tư": "",
    "Thứ Năm": "",
    "Thứ Sáu": "",
  };

  const shortDatesMap: Record<DayOfWeek, string> = {
    "Thứ Hai": "",
    "Thứ Ba": "",
    "Thứ Tư": "",
    "Thứ Năm": "",
    "Thứ Sáu": "",
  };

  daysOfWeekList.forEach((dow) => {
    const d = new Date(baseYear, baseMonth, baseDay + (weekNumber - 1) * 7 + dayOffsets[dow]);
    fullDatesMap[dow] = formatDate(d);
    shortDatesMap[dow] = formatShort(d);
  });

  const mondayDate = new Date(baseYear, baseMonth, baseDay + (weekNumber - 1) * 7);
  const fridayDate = new Date(baseYear, baseMonth, baseDay + (weekNumber - 1) * 7 + 4);

  return {
    weekStartDate: formatDate(mondayDate),
    weekEndDate: formatDate(fridayDate),
    shortDatesMap,
    fullDatesMap,
  };
}

/**
 * Clean subject title from suffixes like (GV Chuyên), (Thủy), etc.
 */
export function normalizeSubjectKey(subj: string): string {
  if (!subj) return "";
  const s = subj.trim();
  const lower = s.toLowerCase();

  if (s === "NGHỈ" || s === "Nghỉ" || lower === "nghỉ" || s === "—" || s === "-") return "NGHỈ";

  // Hoạt động trải nghiệm (HĐTN) / Chào cờ / Sinh hoạt lớp
  if (s === "CC" || s === "HĐTN (CC)" || lower.includes("chào cờ") || lower.includes("shdc")) return "HĐTN";
  if (lower.includes("sinh hoạt lớp") || lower.includes("shl")) return "HĐTN";
  if (lower.startsWith("hđtn") || lower.startsWith("hdtn") || lower.startsWith("hđtt") || lower.includes("trải nghiệm")) return "HĐTN";

  // Môn tăng cường
  if (lower.includes("tăng cường") || lower.includes("t.cường") || lower.includes("t.c")) {
    if (lower.includes("toán") || s.startsWith("T")) return "Toán (Tăng cường)";
    if (lower.includes("tiếng việt") || lower.includes("tv")) return "Tiếng Việt (Tăng cường)";
  }

  // Toán
  if (s === "T" || lower.startsWith("toán") || lower === "toán") return "Toán";

  // Tiếng Việt
  if (s === "TV" || lower.startsWith("tiếng việt") || lower === "tiếng việt") return "Tiếng Việt";

  // Specialist Subjects (Giáo viên chuyên môn)
  // Âm nhạc (AN)
  if (
    s === "AN" ||
    lower === "an" ||
    lower.startsWith("an ") ||
    lower.includes("âm nhạc") ||
    lower.includes("am nhac") ||
    lower.includes("hát nhạc") ||
    lower === "nhạc"
  ) {
    return "Âm nhạc";
  }

  // Tin học (TH / TCTH)
  if (
    s === "TH" ||
    lower === "th" ||
    lower.startsWith("th ") ||
    lower.startsWith("tin") ||
    lower.startsWith("tcth") ||
    lower.includes("tin học") ||
    lower.includes("tin hoc")
  ) {
    return "Tin học";
  }

  // Giáo dục thể chất (GDTC / Thể dục)
  if (
    s === "GDTC" ||
    lower === "gdtc" ||
    lower.startsWith("gdtc ") ||
    lower.includes("thể dục") ||
    lower.includes("the duc") ||
    lower.includes("thể chất") ||
    lower.includes("the chat")
  ) {
    return "GDTC";
  }

  // Mĩ thuật / Mỹ thuật (MT)
  if (
    s === "MT" ||
    lower === "mt" ||
    lower.startsWith("mt ") ||
    lower.includes("mĩ thuật") ||
    lower.includes("mỹ thuật") ||
    lower.includes("mi thuat") ||
    lower.includes("my thuat")
  ) {
    return "Mĩ thuật";
  }

  // Tiếng Anh (TA)
  if (
    s === "TA" ||
    lower === "ta" ||
    lower.startsWith("ta ") ||
    lower.includes("tiếng anh") ||
    lower.includes("tieng anh") ||
    lower.includes("anh văn") ||
    lower.includes("ngoại ngữ")
  ) {
    return "Tiếng Anh";
  }

  // Đạo đức (ĐĐ)
  if (
    s === "ĐĐ" ||
    s === "DD" ||
    lower === "đđ" ||
    lower === "dd" ||
    lower.includes("đạo đức") ||
    lower.includes("dao duc")
  ) {
    return "Đạo đức";
  }

  // Tự nhiên và Xã hội (TNXH)
  if (
    s === "TNXH" ||
    lower === "tnxh" ||
    lower.includes("tự nhiên") ||
    lower.includes("tu nhien") ||
    lower.includes("tn&xh")
  ) {
    return "TNXH";
  }

  return s.split(" (")[0].trim();
}

/**
 * Returns periods per week for standard subjects to calculate cumulative PPCT
 */
function getPeriodsPerWeek(subjectKey: string): number {
  switch (subjectKey) {
    case "Tiếng Việt":
      return 10;
    case "Toán":
      return 5;
    case "HĐTN":
      return 3;
    case "TNXH":
    case "Âm nhạc":
    case "GDTC":
    case "Tin học":
    case "Tiếng Anh":
      return 2;
    case "Đạo đức":
    case "Mĩ thuật":
    case "Toán (Tăng cường)":
    case "Tiếng Việt (Tăng cường)":
      return 1;
    default:
      return 2;
  }
}

/**
 * Exact lesson title provider for Grade 2 (and other grades)
 */
export function getDetailedLessonTitle(
  rawSubject: string,
  grade: GradeLevel,
  week: number,
  countInWeek: number
): string {
  const normKey = normalizeSubjectKey(rawSubject);

  if (normKey === "NGHỈ" || rawSubject === "NGHỈ" || rawSubject === "Nghỉ" || rawSubject === "—") {
    return "NGHỈ";
  }

  // Exact curriculum for Grade 2
  if (grade === 2) {
    if (week === 1) {
      if (normKey === "HĐTN") {
        if (countInWeek === 1) return "Sinh hoạt dưới cờ: Tham gia Lễ khai giảng năm học mới 2026 - 2027";
        if (countInWeek === 2) return "HĐGD theo chủ đề: Em tự hào là học sinh lớp 2";
        return "Sinh hoạt lớp: Nền nếp học tập và kĩ năng tự phục vụ";
      }
      if (normKey === "Toán") {
        if (countInWeek === 1) return "Bài 1: Ôn tập các số đến 100 (Tiết 1)";
        if (countInWeek === 2) return "Bài 1: Ôn tập các số đến 100 (Tiết 2)";
        if (countInWeek === 3) return "Bài 2: Tia số. Số liền trước, số liền sau (Tiết 1)";
        if (countInWeek === 4) return "Bài 2: Tia số. Số liền trước, số liền sau (Tiết 2)";
        if (countInWeek === 5) return "Bài 3: Các thành phần của phép cộng, phép trừ (Tiết 1)";
        return `Toán 2: Luyện tập củng cố (Tiết ${countInWeek})`;
      }
      if (normKey === "Toán (Tăng cường)") {
        return "Luyện tập củng cố phép cộng và nhận biết tia số thực hành";
      }
      if (normKey === "Tiếng Việt") {
        switch (countInWeek) {
          case 1:
            return "Bài 1: Tôi là học sinh lớp 2 (Tiết 1 - Đọc)";
          case 2:
            return "Bài 1: Tôi là học sinh lớp 2 (Tiết 2 - Đọc)";
          case 3:
            return "Chữ hoa A (Tiết 1 - Viết)";
          case 4:
            return 'Luyện viết câu ứng dụng: "Ăn chậm nhai kĩ" (Viết)';
          case 5:
            return "Từ chỉ sự vật, hoạt động xung quanh em (Luyện từ và câu)";
          case 6:
            return "Nói lời chào, lời cảm ơn trong lớp học (Nói và nghe)";
          case 7:
            return "Bài 2: Ngày hôm qua đâu rồi? (Tiết 1 - Đọc)";
          case 8:
            return "Bài 2: Ngày hôm qua đâu rồi? (Tiết 2 - Đọc)";
          case 9:
            return "Luyện tập viết đoạn văn: Giới thiệu bản thân (Viết)";
          case 10:
            return "Đọc câu chuyện, bài thơ về trường lớp, bạn bè (Đọc mở rộng)";
          default:
            return `Tiếng Việt 2: Luyện tập thực hành (Tiết ${countInWeek})`;
        }
      }
      if (normKey === "Âm nhạc") {
        if (countInWeek === 1) return "Hát: Ngày mùa vui (Dân ca Thái)";
        return "Luyện thanh và gõ đệm theo tiết tấu bài 'Ngày mùa vui'";
      }
      if (normKey === "TNXH") {
        if (countInWeek === 1) return "Bài 1: Các thế hệ trong gia đình (Tiết 1)";
        return "Bài 1: Các thế hệ trong gia đình (Tiết 2)";
      }
      if (normKey === "Tiếng Anh") {
        if (countInWeek === 1) return "Unit 1: Back to School - Lesson 1";
        return "Unit 1: Back to School - Lesson 2";
      }
      if (normKey === "Đạo đức") {
        return "Bài 1: Quý trọng thời gian (Tiết 1)";
      }
      if (normKey === "GDTC") {
        if (countInWeek === 1) return "Đội hình đội ngũ: Nghiêm, nghỉ, quay phải, quay trái";
        return "Trò chơi vận động rèn luyện sự nhanh nhẹn, khéo léo";
      }
      if (normKey === "Tin học") {
        if (countInWeek === 1) return "Làm quen với máy tính và phòng máy thực hành (Tiết 1)";
        return "Làm quen với chuột máy tính và bàn phím (Tiết 2)";
      }
      if (normKey === "Mĩ thuật") {
        return "Chủ đề 1: Sắc màu em yêu - Khám phá các nét vẽ và màu sắc";
      }
    }
  }

  // Fallback for subsequent weeks or general grades
  return getStandardLessonTitle(rawSubject, grade, week);
}

export function getStandardLessonTitle(subject: string, grade: GradeLevel, week: number): string {
  const normKey = normalizeSubjectKey(subject);
  if (normKey === "NGHỈ") return "NGHỈ";
  if (normKey === "HĐTN") {
    if (subject.includes("CC") || subject.includes("Chào cờ")) return `Sinh hoạt dưới cờ Tuần ${week}: Khai giảng / Chủ điểm`;
    if (subject.includes("SHL")) return `Sinh hoạt lớp Tuần ${week}: Đánh giá nề nếp và phương hướng`;
    return `HĐTN Tuần ${week}: Hoạt động giáo dục theo chủ đề`;
  }
  if (normKey === "Tiếng Việt") {
    return `Tiếng Việt Tuần ${week}: Bài học chủ điểm và rèn luyện kĩ năng đọc - viết`;
  }
  if (normKey === "Toán") {
    return `Toán Tuần ${week}: Luyện tập và củng cố kiến thức trọng tâm`;
  }
  if (normKey === "TNXH") return `Tự nhiên và Xã hội Tuần ${week}: Khám phá cuộc sống xung quanh`;
  if (normKey === "Tiếng Anh") return `English: Unit ${week} - Lessons & Language Focus`;
  if (normKey === "Đạo đức") return `Đạo đức Tuần ${week}: Hành vi chuẩn mực và bài học đạo đức`;
  if (normKey === "Âm nhạc") return `Âm nhạc Tuần ${week}: Học hát và gõ đệm theo giai điệu`;
  if (normKey === "GDTC") return `GDTC Tuần ${week}: Đội hình đội ngũ và bài tập thể lực`;
  if (normKey === "Mĩ thuật") return `Mĩ thuật Tuần ${week}: Sáng tạo nghệ thuật với sắc màu`;
  if (normKey === "Tin học") return `Tin học Tuần ${week}: Kĩ năng máy tính và Năng lực số`;
  return `Bài học Tuần ${week} - ${subject}`;
}

/**
 * Generate LBG entries from Timetable for classroom teacher or specialist teacher.
 */
export function generateLBGFromTimetable(
  profile: SchoolProfile,
  schedule: TimetableSlot[],
  teachers: TeacherInfo[],
  selectedTeacherId: string,
  selectedClassId: string
): TeachingScheduleEntry[] {
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  const entries: TeachingScheduleEntry[] = [];
  const { shortDatesMap } = calculateWeekDates(profile.currentWeek || 1, profile.weekStartDate || "07/09/2026");
  const subjectCounters: Record<string, number> = {};

  if (currentTeacher?.isSpecialist) {
    // Specialist teacher: collect periods taught across all classes
    for (const day of daysOfWeekList) {
      const daySlots = schedule.filter((s) => s.day === day);
      let periodCounter = 1;

      for (const slot of daySlots) {
        for (const [cls, cell] of Object.entries(slot.assignments)) {
          if (
            cell.teacher === currentTeacher.shortName ||
            cell.teacher === currentTeacher.name ||
            (currentTeacher.subjectSpecialty && cell.subject.includes(currentTeacher.subjectSpecialty))
          ) {
            const cleanSubj = normalizeSubjectKey(cell.subject);
            const count = (subjectCounters[cleanSubj] = (subjectCounters[cleanSubj] || 0) + 1);
            const ppctNumber = (profile.currentWeek - 1) * getPeriodsPerWeek(cleanSubj) + count;

            entries.push({
              id: `lbg-${day}-${slot.session}-${slot.period}-${cls}`,
              dayOfWeek: day,
              dateStr: shortDatesMap[day] || "07/09",
              session: slot.session,
              periodInDay: periodCounter++,
              subject: `${cell.subject} (Lớp ${cls})`,
              ppct: ppctNumber,
              lessonTitle: getDetailedLessonTitle(cell.subject, profile.grade, profile.currentWeek, count),
              integrationNote: "", // Strictly empty by default
              isSpecialistPeriod: true,
              specialistTeacherName: currentTeacher.name,
            });
          }
        }
      }
    }
  } else {
    // Classroom teacher (GVCN): standard 7 periods per day (Sáng 4 + Chiều 3)
    for (const day of daysOfWeekList) {
      const morningSlots = schedule.filter((s) => s.day === day && s.session === "Sáng");
      const afternoonSlots = schedule.filter((s) => s.day === day && s.session === "Chiều");

      let pInDay = 1;

      // Sáng: 4 periods
      for (const slot of morningSlots.slice(0, 4)) {
        const cell = slot.assignments[selectedClassId] || slot.assignments["2.2"] || slot.assignments["2A"];
        const rawSubj = cell?.subject || "—";
        const isNghi = rawSubj === "NGHỈ" || rawSubj === "Nghỉ" || rawSubj === "—";
        const isSpec =
          cell?.isSpecialist ||
          isSpecialistSubject(rawSubj, cell?.teacher) ||
          (cell?.teacher && cell.teacher !== profile.teacherName && !cell.teacher.includes("Ngọc"));

        let ppctVal: string | number = "";
        let lessonTitleVal = "NGHỈ";

        if (!isNghi) {
          const normKey = normalizeSubjectKey(rawSubj);
          const count = (subjectCounters[normKey] = (subjectCounters[normKey] || 0) + 1);
          ppctVal = (profile.currentWeek - 1) * getPeriodsPerWeek(normKey) + count;
          lessonTitleVal = getDetailedLessonTitle(rawSubj, profile.grade, profile.currentWeek, count);
        }

        entries.push({
          id: `lbg-${day}-Sáng-${slot.period}`,
          dayOfWeek: day,
          dateStr: shortDatesMap[day] || "07/09",
          session: "Sáng",
          periodInDay: pInDay++,
          subject: isNghi ? "NGHỈ" : rawSubj,
          ppct: ppctVal,
          lessonTitle: lessonTitleVal,
          integrationNote: "", // Clean empty by default as requested
          isSpecialistPeriod: !!isSpec,
          specialistTeacherName: isSpec ? (cell?.teacher ? formatTeacherDisplayName(cell.teacher) : getDefaultSpecialistTeacherName(normalizeSubjectKey(rawSubj))) : undefined,
        });
      }

      // Chiều: 3 periods (Total 7 per day)
      for (const slot of afternoonSlots.slice(0, 3)) {
        const cell = slot.assignments[selectedClassId] || slot.assignments["2.2"] || slot.assignments["2A"];
        const rawSubj = cell?.subject || "—";
        const isNghi = rawSubj === "NGHỈ" || rawSubj === "Nghỉ" || rawSubj === "—";
        const isSpec =
          cell?.isSpecialist ||
          isSpecialistSubject(rawSubj, cell?.teacher) ||
          (cell?.teacher && cell.teacher !== profile.teacherName && !cell.teacher.includes("Ngọc"));

        let ppctVal: string | number = "";
        let lessonTitleVal = "NGHỈ";

        if (!isNghi) {
          const normKey = normalizeSubjectKey(rawSubj);
          const count = (subjectCounters[normKey] = (subjectCounters[normKey] || 0) + 1);
          ppctVal = (profile.currentWeek - 1) * getPeriodsPerWeek(normKey) + count;
          lessonTitleVal = getDetailedLessonTitle(rawSubj, profile.grade, profile.currentWeek, count);
        }

        entries.push({
          id: `lbg-${day}-Chiều-${slot.period}`,
          dayOfWeek: day,
          dateStr: shortDatesMap[day] || "07/09",
          session: "Chiều",
          periodInDay: pInDay++,
          subject: isNghi ? "NGHỈ" : rawSubj,
          ppct: ppctVal,
          lessonTitle: lessonTitleVal,
          integrationNote: "", // Clean empty by default as requested
          isSpecialistPeriod: !!isSpec,
          specialistTeacherName: isSpec ? (cell?.teacher ? formatTeacherDisplayName(cell.teacher) : getDefaultSpecialistTeacherName(normalizeSubjectKey(rawSubj))) : undefined,
        });
      }
    }
  }

  return entries;
}

export function isSpecialistTeacherName(teacherName?: string): boolean {
  if (!teacherName) return false;
  const t = teacherName.toLowerCase();
  return (
    t.includes("thành") ||
    t.includes("sang") ||
    t.includes("tiến") ||
    t.includes("tân") ||
    t.includes("xuân") ||
    t.includes("hoa") ||
    t.includes("an") ||
    t.includes("nương") ||
    t.includes("tuệ") ||
    t.includes("thy") ||
    t.includes("nhàn") ||
    t.includes("phương") ||
    t.includes("thủy") ||
    t.includes("chuyên")
  );
}

/**
 * Checks if a subject belongs strictly to the Homeroom Teacher (GVCN).
 * In Grade 2, GVCN ONLY teaches:
 * - Toán (and Toán tăng cường)
 * - Tiếng Việt (and Tiếng Việt tăng cường)
 * - Hoạt động trải nghiệm (HĐTN / Chào cờ / Sinh hoạt lớp)
 * All other subjects belong to specialist teachers!
 */
export function isGVCNSubject(rawSubject: string, teacherName?: string): boolean {
  if (!rawSubject) return false;
  const s = rawSubject.trim();
  if (s === "NGHỈ" || s === "Nghỉ" || s === "—" || s === "-") return false;

  // If teacher assigned is explicitly a specialist teacher, it is NOT GVCN
  if (teacherName && isSpecialistTeacherName(teacherName)) return false;

  const norm = normalizeSubjectKey(rawSubject);
  return (
    norm === "Toán" ||
    norm === "Toán (Tăng cường)" ||
    norm === "Tiếng Việt" ||
    norm === "Tiếng Việt (Tăng cường)" ||
    norm === "HĐTN"
  );
}

/**
 * Checks if a subject belongs to Specialist Teachers (GV Chuyên môn).
 * Includes: Âm nhạc (AN), Tin học (TH), GDTC, Mĩ thuật/Mỹ thuật (MT),
 * Tiếng Anh (TA), TNXH, Đạo đức (ĐĐ)...
 */
export function isSpecialistSubject(rawSubject: string, teacherName?: string): boolean {
  if (!rawSubject || rawSubject === "NGHỈ" || rawSubject === "Nghỉ" || rawSubject === "—" || rawSubject === "-") {
    return false;
  }
  return !isGVCNSubject(rawSubject, teacherName);
}

export function formatTeacherDisplayName(teacherName: string, subject?: string): string {
  if (!teacherName) return "GV Chuyên";
  const t = teacherName.trim();
  if (t.startsWith("Cô ") || t.startsWith("Thầy ")) return t;
  if (t === "Ngọc") return "Cô Ngọc";
  if (t === "An") return "Cô An";
  if (t === "Thành") return "Thầy Thành";
  if (t === "Tiến") return "Thầy Tiến";
  if (t === "Sang") return "Thầy Sang";
  if (t === "Tân") return "Thầy Tân";
  if (t === "Xuân") return "Cô Xuân";
  if (t === "Hoa") return "Cô Hoa";
  if (t === "Tuệ") return "Cô Tuệ";
  if (t === "Thy") return "Cô Thy";
  if (t === "Nương") return "Cô Nương";
  if (t === "Nhàn") return "Cô Nhàn";
  if (t === "Phương") return "Cô Phương";
  if (t === "Thủy") return "Cô Thủy";
  if (t === "Nam" || t === "Đạt" || t === "Phước" || t === "Tuấn") return `Thầy ${t}`;
  return `GV ${t}`;
}

export function getDefaultSpecialistTeacherName(cleanSubject: string): string {
  if (cleanSubject === "Tiếng Anh") return "Cô An";
  if (cleanSubject === "Âm nhạc") return "Thầy Thành";
  if (cleanSubject === "Mĩ thuật") return "Thầy Sang";
  if (cleanSubject === "GDTC") return "Thầy Tiến";
  if (cleanSubject === "Đạo đức") return "Thầy Tân";
  if (cleanSubject === "TNXH") return "Cô Xuân";
  if (cleanSubject === "Tin học") return "Cô Hoa";
  return "GV Chuyên môn";
}

/**
 * Generate synchronized Lesson Plans matching the current LBG / Timetable subjects
 * Strictly separates GVCN plans from GV Chuyên plans
 */
export function generateSynchronizedLessonPlans(
  profile: SchoolProfile,
  lbgEntries: TeachingScheduleEntry[],
  targetRole: "gvcn" | "specialist" | "all" = "gvcn"
): LessonPlan[] {
  const plans: LessonPlan[] = [];
  const processedKeys = new Set<string>();

  for (const entry of lbgEntries) {
    if (entry.subject === "NGHỈ" || entry.subject === "—") continue;

    const isSpec = !!entry.isSpecialistPeriod || isSpecialistSubject(entry.subject, entry.specialistTeacherName);

    // CRITICAL DIRECTIVE:
    // If generating for GVCN, NEVER create plans for specialist subjects (AN, TH, GDTC, MT, TA, TNXH, Đạo đức)!
    if (targetRole === "gvcn" && isSpec) {
      continue;
    }
    // If generating for Specialist, skip GVCN subjects (Toán, Tiếng Việt, HĐTN)
    if (targetRole === "specialist" && !isSpec) {
      continue;
    }

    const key = `${entry.subject}-${entry.lessonTitle}-${entry.ppct}`;
    if (processedKeys.has(key)) continue;
    processedKeys.add(key);

    const cleanSubject = normalizeSubjectKey(entry.subject);
    const specTeacherName = isSpec
      ? entry.specialistTeacherName || getDefaultSpecialistTeacherName(cleanSubject)
      : undefined;

    // Tailor objectives & equipment according to subject
    let specComp = [
      `Nắm vững kiến thức và kĩ năng trọng tâm của bài '${entry.lessonTitle}' theo Chương trình GDPT 2018.`,
      "Hình thành và rèn luyện năng lực tư duy, kĩ năng thực hành ứng dụng giải quyết vấn đề thực tế.",
    ];
    let equipTeacher = "Kế hoạch bài dạy, giáo án điện tử / màn hình tương tác, bộ đồ dùng dạy học lớp 2.";
    let equipStudents = "Sách giáo khoa, vở bài tập, bảng con, bút chì và đồ dùng học tập lớp 2.";

    if (cleanSubject === "Toán") {
      specComp = [
        "Nắm chắc các số đến 100, cấu tạo số, thứ tự các số và thực hiện thành thạo phép tính cộng trừ cơ bản.",
        "Phát triển năng lực tư duy toán học, năng lực giải quyết vấn đề toán học thông qua các tình huống thực tế.",
      ];
      equipTeacher = "Bộ đồ dùng dạy Toán lớp 2, que tính, tia số phóng to, màn hình tương tác / phiếu học tập.";
      equipStudents = "Bộ đồ dùng học Toán lớp 2, que tính, bảng con, vở bài tập Toán.";
    } else if (cleanSubject === "Tiếng Việt") {
      specComp = [
        "Rèn luyện kĩ năng đọc đúng, rõ ràng, hiểu nội dung văn bản; rèn chữ viết hoa và quy tắc chính tả tiếng Việt.",
        "Phát triển năng lực ngôn ngữ, năng lực giao tiếp: tự tin nói lời chào, lời cảm ơn và diễn đạt ý kiến trước lớp.",
      ];
      equipTeacher = "Tranh ảnh minh họa bài đọc, bảng phụ chép sẵn bài thơ/đoạn văn, chữ hoa mẫu phóng to.";
      equipStudents = "Sách giáo khoa Tiếng Việt 2 (tập 1), vở Tập viết, bảng con, bút mực.";
    } else if (cleanSubject === "HĐTN") {
      specComp = [
        "Tích cực tham gia các hoạt động tập thể của trường lớp; rèn luyện thói quen tự phục vụ và nếp sống kỉ luật.",
        "Phát triển năng lực thích ứng với cuộc sống, thiết lập mối quan hệ thân thiện với thầy cô và bạn bè.",
      ];
      equipTeacher = "Kịch bản hoạt động trải nghiệm, micro, loa di động, hoa điểm tốt, video/hình ảnh tư liệu.";
      equipStudents = "Trang phục chỉnh tề, khăn quàng (nếu có), tinh thần hào hứng tham gia hoạt động.";
    } else if (cleanSubject === "Âm nhạc") {
      specComp = [
        "Biết hát đúng giai điệu, lời ca bài hát; biết vỗ tay, gõ đệm theo phách, nhịp và tiết tấu bài hát vui tươi.",
        "Phát triển năng lực cảm thụ âm nhạc, tự tin biểu diễn trước tập thể lớp.",
      ];
      equipTeacher = "Đàn phím điện tử, thanh phách, song loan, file âm thanh bài hát chuẩn chất lượng cao.";
      equipStudents = "Thanh phách gõ nhịp, sách Âm nhạc 2, trang phục thoải mái.";
    } else if (cleanSubject === "Mĩ thuật") {
      specComp = [
        "Nhận biết các màu cơ bản và đường nét; biết vẽ hoặc xé dán tạo hình bức tranh sắc màu sáng tạo.",
        "Rèn luyện năng lực thẩm mĩ, biết trân trọng cái đẹp và chia sẻ cảm nhận về tác phẩm của mình và bạn bè.",
      ];
      equipTeacher = "Tranh mẫu mĩ thuật, giấy khổ lớn, màu vẽ minh họa, video hướng dẫn thao tác tạo hình.";
      equipStudents = "Vở thực hành Mĩ thuật 2, bút chì, màu sáp/màu nước, giấy thủ công, kéo, hồ dán.";
    } else if (cleanSubject === "Tiếng Anh") {
      specComp = [
        "Understand and accurately pronounce new words and simple classroom instructions in English.",
        "Develop English communication competencies: greeting, introducing oneself and asking simple questions.",
      ];
      equipTeacher = "English flashcards, audio tracks, interactive projector / monitor, puppets.";
      equipStudents = "English 2 textbook, activity book, notebooks, colored pencils.";
    } else if (cleanSubject === "GDTC") {
      specComp = [
        "Biết cách tập hợp hàng dọc, dóng hàng, điểm số, đứng nghiêm, nghỉ, quay phải, quay trái đúng tư thế.",
        "Rèn luyện thói quen rèn luyện thể chất hằng ngày, nâng cao sức khỏe và tinh thần đồng đội.",
      ];
      equipTeacher = "Còi điều khiển, đồng hồ bấm giờ, cờ hiệu, sân tập bằng phẳng, sạch sẽ, an toàn.",
      equipStudents = "Trang phục thể thao thoáng mát, giày vải đúng quy định, nước uống cá nhân.";
    } else if (cleanSubject === "Tin học") {
      specComp = [
        "Nhận biết các bộ phận chính của máy tính; biết sử dụng chuột máy tính đúng cách (chuột trái, chuột phải).",
        "Hình thành Năng lực số (NLS 3456/BGDĐT): ý thức giữ gìn thiết bị công nghệ và bảo đảm an toàn khi dùng máy tính.",
      ];
      equipTeacher = "Phòng máy tính kết nối mạng an toàn, máy chiếu/màn hình tương tác giáo viên, phần mềm thực hành.",
      equipStudents = "Vở ghi chép Tin học 2, tuân thủ nghiêm nội quy phòng máy thực hành.";
    } else if (cleanSubject === "TNXH") {
      specComp = [
        "Nêu được các thế hệ trong gia đình và thể hiện tình cảm yêu thương, kính trọng ông bà, cha mẹ.",
        "Phát triển năng lực tìm hiểu môi trường tự nhiên và xã hội xung quanh em.",
      ];
      equipTeacher = "Tranh ảnh gia đình nhiều thế hệ, video ngắn, sơ đồ phả hệ trực quan.",
      equipStudents = "Sách giáo khoa TNXH 2, ảnh chụp gia đình (nếu có), phiếu học tập.";
    } else if (cleanSubject === "Đạo đức") {
      specComp = [
        "Nhận biết vì sao cần quý trọng thời gian và biết lập thời gian biểu hợp lí cho hoạt động trong ngày.",
        "Hình thành phẩm chất chăm chỉ, trách nhiệm với việc học tập và sinh hoạt của bản thân.",
      ];
      equipTeacher = "Tranh tình huống đạo đức, đồng hồ mô hình, phiếu trắc nghiệm hành vi.",
      equipStudents = "Sách giáo khoa Đạo đức 2, bút chì, thời gian biểu mẫu của cá nhân.";
    }

    plans.push({
      id: `khbd-${entry.id}`,
      subject: cleanSubject,
      grade: profile.grade,
      week: profile.currentWeek,
      dayOfWeek: entry.dayOfWeek,
      session: entry.session,
      periodInDay: entry.periodInDay,
      period: `Tiết ${entry.periodInDay} (PPCT ${entry.ppct || 1})`,
      ppctNumber: entry.ppct || 1,
      lessonTitle: entry.lessonTitle,
      teacherName: isSpec ? (specTeacherName || "GV Chuyên môn") : profile.teacherName,
      className: profile.className,
      isSpecialist: isSpec,
      specialistTeacherName: specTeacherName,
      objectives: {
        specificCompetencies: specComp,
        generalCompetencies: [
          "Năng lực tự chủ và tự học: Tự giác hoàn thành các nhiệm vụ học tập theo hướng dẫn của giáo viên.",
          "Năng lực giao tiếp và hợp tác: Tích cực thảo luận nhóm, chia sẻ ý kiến với bạn bè.",
          "Năng lực số (NLS) theo CV 3456/BGDĐT: Làm quen với hình ảnh, tư liệu số trực quan trên màn hình thông minh an toàn.",
        ],
        qualities: [
          "Chăm chỉ: Tích cực suy nghĩ, hoàn thành bài tập đầy đủ và cẩn thận.",
          "Trách nhiệm: Giữ gìn sách vở sạch đẹp, có ý thức tổ chức kỉ luật trong lớp học.",
          "Yêu nước & Nhân ái: Yêu quý trường lớp, thầy cô và đoàn kết, giúp đỡ bạn bè.",
        ],
      },
      equipment: {
        teacher: equipTeacher,
        students: equipStudents,
      },
      activities: [
        {
          step: 1,
          title: "1. Khởi động (5 phút)",
          objective: "Tạo không khí vui tươi, hào hứng và kết nối kiến thức vào bài học mới.",
          teacherActivity: "Tổ chức trò chơi khởi động sôi nổi hoặc cho học sinh hát múa tập thể. Dẫn dắt giới thiệu vào bài học.",
          studentActivity: "Học sinh tham gia nhiệt tình, tạo tâm thế phấn khởi và sẵn sàng tiếp thu bài mới.",
        },
        {
          step: 2,
          title: "2. Khám phá (12-15 phút)",
          objective: "Hình thành kiến thức mới, hướng dẫn học sinh tìm tòi và chiếm lĩnh nội dung trọng tâm.",
          teacherActivity: "Trình chiếu ngữ liệu/hình ảnh trực quan, đặt câu hỏi gợi mở, tổ chức học sinh làm việc cá nhân và nhóm.",
          studentActivity: "Học sinh quan sát, lắng nghe, thảo luận theo cặp/nhóm để khám phá và rút ra nhận xét bài học.",
        },
        {
          step: 3,
          title: "3. Luyện tập - Thực hành (10-12 phút)",
          objective: "Rèn luyện kĩ năng, thực hành bài tập củng cố ngay tại lớp.",
          teacherActivity: "Giao nhiệm vụ bài tập cụ thể, theo dõi, giúp đỡ kịp thời những học sinh còn lúng túng; nhận xét biểu dương.",
          studentActivity: "Tự giác làm bài vào vở/bảng con, đổi chéo bài để kiểm tra và nhận xét kết quả của nhau.",
        },
        {
          step: 4,
          title: "4. Vận dụng & Trải nghiệm (5-8 phút)",
          objective: "Vận dụng kiến thức vào thực tế đời sống; lồng ghép Năng lực số, An toàn giao thông, Giáo dục đạo đức.",
          teacherActivity: "Nêu tình huống thực tế liên hệ với bài học, dặn dò học sinh ghi nhớ và chuẩn bị bài cho tiết sau.",
          studentActivity: "Học sinh liên hệ thực tế bản thân và gia đình, tự tin chia sẻ cảm xúc trước lớp.",
        },
      ],
      adjustment: "Học sinh nắm chắc bài học, lớp học sôi nổi, thực hiện tốt các hoạt động.",
    });
  }

  return plans;
}

export interface SpecialistTeacherMetadata {
  id: string;
  name: string;
  subject: string;
  icon: string;
  role: string;
}

export const knownSpecialistsList: SpecialistTeacherMetadata[] = [
  { id: "t-an", name: "Cô An", subject: "Tiếng Anh", icon: "🇬🇧", role: "GV Chuyên Tiếng Anh" },
  { id: "t-thanh", name: "Thầy Thành", subject: "Âm nhạc", icon: "🎵", role: "GV Chuyên Âm nhạc" },
  { id: "t-sang", name: "Thầy Sang", subject: "Mĩ thuật", icon: "🎨", role: "GV Chuyên Mĩ thuật" },
  { id: "t-tien", name: "Thầy Tiến", subject: "GDTC", icon: "🏃", role: "GV Chuyên GDTC" },
  { id: "t-tan", name: "Thầy Tân", subject: "Đạo đức", icon: "📖", role: "GV Chuyên Đạo đức" },
  { id: "t-xuan", name: "Cô Xuân", subject: "TNXH", icon: "🌿", role: "GV Chuyên TNXH" },
  { id: "t-hoa", name: "Cô Hoa", subject: "Tin học", icon: "💻", role: "GV Chuyên Tin học" },
  { id: "t-nuong", name: "Cô Nương", subject: "Tiếng Anh", icon: "🇬🇧", role: "GV Chuyên Tiếng Anh" },
  { id: "t-tue", name: "Cô Tuệ", subject: "Âm nhạc", icon: "🎵", role: "GV Chuyên Âm nhạc" },
  { id: "t-thy", name: "Cô Thy", subject: "Mĩ thuật", icon: "🎨", role: "GV Chuyên Mĩ thuật" },
  { id: "t-nhan", name: "Cô Nhàn", subject: "GDTC", icon: "🏃", role: "GV Chuyên GDTC" },
  { id: "t-phuong", name: "Cô Phương", subject: "Tin học", icon: "💻", role: "GV Chuyên Tin học" },
  { id: "t-thuy", name: "Cô Thủy", subject: "TNXH & Đạo đức", icon: "🌿", role: "GV Chuyên TNXH / Đạo đức" },
];

/**
 * Generate KHBD ONLY for the homeroom teacher (GVCN)
 * Strictly excludes all specialist subjects: Âm nhạc (AN), Tin học (TH), GDTC, Mĩ thuật (MT), Tiếng Anh, Đạo đức, TNXH...
 * Only generates for subjects taught by GVCN: Toán, Tiếng Việt, Hoạt động trải nghiệm (HĐTN)
 */
export function generateLessonPlansForGVCN(
  profile: SchoolProfile,
  lbgEntries: TeachingScheduleEntry[]
): LessonPlan[] {
  const gvcnEntries = lbgEntries.filter((e) => isGVCNSubject(e.subject, e.specialistTeacherName));
  return generateSynchronizedLessonPlans(profile, gvcnEntries, "gvcn");
}

/**
 * Generate KHBD for a specific specialist teacher
 */
export function generateLessonPlansForSpecialistTeacher(
  profile: SchoolProfile,
  lbgEntries: TeachingScheduleEntry[],
  specialistTeacherName: string,
  specialistSubject?: string
): LessonPlan[] {
  const specialistEntries = lbgEntries.filter((e) => {
    const isSpec = !!e.isSpecialistPeriod || isSpecialistSubject(e.subject, e.specialistTeacherName);
    if (!isSpec) return false;
    if (e.specialistTeacherName && (e.specialistTeacherName.includes(specialistTeacherName) || specialistTeacherName.includes(e.specialistTeacherName))) {
      return true;
    }
    if (specialistSubject) {
      const normCur = normalizeSubjectKey(e.subject);
      const normSpec = normalizeSubjectKey(specialistSubject);
      if (normCur === normSpec || e.subject.includes(specialistSubject)) return true;
    }
    return false;
  });
  return generateSynchronizedLessonPlans(profile, specialistEntries, "specialist");
}

