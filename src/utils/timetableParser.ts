import {
  TimetableSlot,
  TimetableCell,
  DayOfWeek,
  SessionType,
  GradeLevel,
} from "../types";
import { daysOfWeekList } from "./syncHelper";

// Subject standardizer
export function standardizeSubjectName(raw: string): string {
  const clean = raw.trim();
  if (!clean || clean === "—" || clean === "-") return "—";
  const lower = clean.toLowerCase();

  if (lower === "tv" || lower === "tiếng việt" || lower.startsWith("tiếng việt")) {
    if (lower.includes("viết")) return "Tiếng Việt (Viết)";
    if (lower.includes("luyện") || lower.includes("lt&c")) return "Tiếng Việt (Luyện từ & câu)";
    if (lower.includes("đọc mr") || lower.includes("đọc mở rộng")) return "Tiếng Việt (Đọc MR)";
    if (lower.includes("tăng cường") || lower.includes("tc")) return "Tiếng Việt (T.cường)";
    if (lower.includes("ôn") || lower.includes("bồi dưỡng")) return "Tiếng Việt (Bồi dưỡng)";
    return "Tiếng Việt";
  }

  if (lower === "t" || lower === "toán" || lower.startsWith("toán")) {
    if (lower.includes("tăng cường") || lower.includes("tc")) return "Toán (T.cường)";
    if (lower.includes("ôn") || lower.includes("bồi dưỡng")) return "Toán (Bồi dưỡng)";
    return "Toán";
  }

  if (lower.includes("hdtn") || lower.includes("hđtn") || lower.includes("hoạt động trải nghiệm") || lower.includes("shdc")) {
    if (lower.includes("cc") || lower.includes("chào cờ") || lower.includes("dưới cờ")) return "HĐTN (Sinh hoạt dưới cờ)";
    if (lower.includes("shl") || lower.includes("lớp")) return "HĐTN (Sinh hoạt lớp)";
    return "HĐTN";
  }

  if (lower.includes("tiếng anh") || lower.includes("english") || lower === "ta") return "Tiếng Anh";
  if (lower.includes("tin học") || lower.includes("tin") || lower.includes("th") || lower.includes("tcth")) return "Tin học";
  if (lower.includes("mĩ thuật") || lower.includes("mỹ thuật") || lower === "mt") return "Mĩ thuật";
  if (lower.includes("âm nhạc") || lower === "an") return "Âm nhạc";
  if (lower.includes("thể dục") || lower.includes("thể chất") || lower === "gdtc") return "GDTC";
  if (lower.includes("tự nhiên và xã hội") || lower.includes("tnxh")) return "TNXH";
  if (lower.includes("khoa học") || lower === "kh") return "Khoa học";
  if (lower.includes("lịch sử") || lower.includes("địa lí") || lower.includes("địa lý") || lower.includes("ls&đl") || lower.includes("ls-đl")) return "Lịch sử & Địa lí";
  if (lower.includes("công nghệ") || lower === "cn") return "Công nghệ";
  if (lower.includes("đạo đức") || lower === "đđ") return "Đạo đức";
  if (lower.includes("kĩ năng sống") || lower.includes("kns")) return "Kĩ năng sống";
  if (lower.includes("sinh hoạt tập thể") || lower.includes("hdtt") || lower.includes("hđtt")) return "HĐTT";
  if (lower.includes("tự học") || lower.includes("th")) return "Tự học";

  return clean;
}

/**
 * Universal text & table parser for Timetables.
 * Can parse Excel copy-paste (tab-separated), Word copy-paste, or plain text.
 */
export function parseTimetableText(
  rawText: string,
  targetClassId: string,
  defaultTeacherName: string,
  baseSchedule: TimetableSlot[]
): TimetableSlot[] {
  if (!rawText.trim()) return baseSchedule;

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const updatedSchedule = baseSchedule.map((slot) => ({
    ...slot,
    assignments: { ...slot.assignments },
  }));

  // Strategy 1: Tab-separated table lines (Excel copy-paste)
  // Format: "Thứ 2 \t Sáng \t 1 \t Tiếng Việt \t Ngọc" or "Thứ 2 \t 1 \t Tiếng Việt"
  const isTSV = lines.some((l) => l.includes("\t"));
  if (isTSV) {
    let currentDay: DayOfWeek = "Thứ Hai";
    let currentSession: SessionType = "Sáng";

    for (const line of lines) {
      const parts = line.split("\t").map((p) => p.trim());
      if (parts.length < 2) continue;

      // Detect Day
      const lineStr = line.toLowerCase();
      if (lineStr.includes("thứ hai") || lineStr.includes("thứ 2")) currentDay = "Thứ Hai";
      else if (lineStr.includes("thứ ba") || lineStr.includes("thứ 3")) currentDay = "Thứ Ba";
      else if (lineStr.includes("thứ tư") || lineStr.includes("thứ 4")) currentDay = "Thứ Tư";
      else if (lineStr.includes("thứ năm") || lineStr.includes("thứ 5")) currentDay = "Thứ Năm";
      else if (lineStr.includes("thứ sáu") || lineStr.includes("thứ 6")) currentDay = "Thứ Sáu";

      if (lineStr.includes("chiều")) currentSession = "Chiều";
      else if (lineStr.includes("sáng")) currentSession = "Sáng";

      // Look for period number
      let periodNum = 0;
      let subjectStr = "";
      let teacherStr = defaultTeacherName;

      for (const part of parts) {
        const num = parseInt(part, 10);
        if (!periodNum && !isNaN(num) && num >= 1 && num <= 5) {
          periodNum = num;
        } else if (
          part &&
          !part.toLowerCase().includes("thứ") &&
          !part.toLowerCase().includes("sáng") &&
          !part.toLowerCase().includes("chiều") &&
          isNaN(Number(part))
        ) {
          if (!subjectStr) {
            subjectStr = part;
          } else {
            teacherStr = part;
          }
        }
      }

      if (periodNum > 0 && subjectStr) {
        const slotIdx = updatedSchedule.findIndex(
          (s) => s.day === currentDay && s.session === currentSession && s.period === periodNum
        );
        if (slotIdx >= 0) {
          const finalSubj = standardizeSubjectName(subjectStr);
          updatedSchedule[slotIdx].assignments[targetClassId] = {
            subject: finalSubj,
            teacher: teacherStr || defaultTeacherName,
            isSpecialist: !!teacherStr && teacherStr !== defaultTeacherName,
          };
        }
      }
    }
    return updatedSchedule;
  }

  // Strategy 2: Text blocks and lines
  let currentDay: DayOfWeek = "Thứ Hai";
  let currentSession: SessionType = "Sáng";

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Check Day Header
    if (lower.includes("thứ hai") || lower.includes("thứ 2")) currentDay = "Thứ Hai";
    else if (lower.includes("thứ ba") || lower.includes("thứ 3")) currentDay = "Thứ Ba";
    else if (lower.includes("thứ tư") || lower.includes("thứ 4")) currentDay = "Thứ Tư";
    else if (lower.includes("thứ năm") || lower.includes("thứ 5")) currentDay = "Thứ Năm";
    else if (lower.includes("thứ sáu") || lower.includes("thứ 6")) currentDay = "Thứ Sáu";

    // Check Session
    if (lower.includes("buổi chiều") || (lower.includes("chiều") && !lower.includes("tiếng"))) {
      currentSession = "Chiều";
    }
    if (lower.includes("buổi sáng") || (lower.includes("sáng") && !lower.includes("tiếng"))) {
      currentSession = "Sáng";
    }

    // Match period lists e.g. "Tiết 1: TV, Tiết 2: TV, Tiết 3: Toán, Tiết 4: HĐTN"
    // or "1. TV, 2. TV, 3. Toán, 4. HĐTN"
    // or "1 - TV (Ngọc), 2 - Toán"
    const periodMatches = line.matchAll(/(?:tiết|t|tiết học)?\s*([1-5])\s*[:.-]\s*([^\d,;\n]+)/gi);
    let matchedAny = false;

    for (const match of periodMatches) {
      matchedAny = true;
      const p = parseInt(match[1], 10);
      let rawSubject = match[2].trim();
      let assignedTeacher = defaultTeacherName;

      // Check if teacher in parenthesis: e.g. "Tiếng Anh (Nương)"
      const tMatch = rawSubject.match(/\(([^)]+)\)/);
      if (tMatch) {
        assignedTeacher = tMatch[1].trim();
        rawSubject = rawSubject.replace(/\([^)]+\)/, "").trim();
      }

      // Infer session if period > 4 or if explicitly indicated
      const session = currentSession;
      const slotIdx = updatedSchedule.findIndex(
        (s) => s.day === currentDay && s.session === session && s.period === p
      );
      if (slotIdx >= 0) {
        const finalSubj = standardizeSubjectName(rawSubject);
        updatedSchedule[slotIdx].assignments[targetClassId] = {
          subject: finalSubj,
          teacher: assignedTeacher,
          isSpecialist: assignedTeacher !== defaultTeacherName,
        };
      }
    }

    // If no numbered match, check comma separated list for full day:
    // e.g. "Thứ 2: HĐTN, TV, TV, Toán, GDTC, Đạo đức, Tự học"
    if (!matchedAny && line.includes(":")) {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const items = parts[1].split(/[,;]/).map((i) => i.trim()).filter(Boolean);
        if (items.length >= 4) {
          // First 4 are Morning 1-4
          items.slice(0, 4).forEach((item, idx) => {
            const p = idx + 1;
            let rawSubj = item;
            let teacher = defaultTeacherName;
            const tm = rawSubj.match(/\(([^)]+)\)/);
            if (tm) {
              teacher = tm[1].trim();
              rawSubj = rawSubj.replace(/\([^)]+\)/, "").trim();
            }
            const sIdx = updatedSchedule.findIndex(
              (s) => s.day === currentDay && s.session === "Sáng" && s.period === p
            );
            if (sIdx >= 0) {
              updatedSchedule[sIdx].assignments[targetClassId] = {
                subject: standardizeSubjectName(rawSubj),
                teacher,
                isSpecialist: teacher !== defaultTeacherName,
              };
            }
          });

          // Next are Afternoon 1-3
          items.slice(4, 7).forEach((item, idx) => {
            const p = idx + 1;
            let rawSubj = item;
            let teacher = defaultTeacherName;
            const tm = rawSubj.match(/\(([^)]+)\)/);
            if (tm) {
              teacher = tm[1].trim();
              rawSubj = rawSubj.replace(/\([^)]+\)/, "").trim();
            }
            const sIdx = updatedSchedule.findIndex(
              (s) => s.day === currentDay && s.session === "Chiều" && s.period === p
            );
            if (sIdx >= 0) {
              updatedSchedule[sIdx].assignments[targetClassId] = {
                subject: standardizeSubjectName(rawSubj),
                teacher,
                isSpecialist: teacher !== defaultTeacherName,
              };
            }
          });
        }
      }
    }
  }

  return updatedSchedule;
}
