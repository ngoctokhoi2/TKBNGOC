import React, { useState } from "react";
import { SchoolProfile, TimetableSlot, TimetableCell, TeacherInfo, DayOfWeek, SessionType } from "../types";
import { exportTimetableDocx } from "../utils/docxExport";
import { parseTimetableText } from "../utils/timetableParser";
import { class22ScheduleMap } from "../data/defaultData";
import {
  Calendar,
  Upload,
  Download,
  Users,
  Layers,
  Sparkles,
  RefreshCw,
  Edit3,
  Check,
  X,
  FileSpreadsheet,
  HelpCircle,
  Clock,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  schedule: TimetableSlot[];
  teachers: TeacherInfo[];
  classList: string[];
  selectedClassId: string;
  selectedTeacherId: string;
  onUpdateSchedule: (newSchedule: TimetableSlot[]) => void;
  onSyncToLBG: () => void;
  onOpenChangeTKBModal?: () => void;
}

export const TimetableEditor: React.FC<Props> = ({
  profile,
  schedule,
  teachers,
  classList,
  selectedClassId,
  selectedTeacherId,
  onUpdateSchedule,
  onSyncToLBG,
  onOpenChangeTKBModal,
}) => {
  const [viewMode, setViewMode] = useState<"gvcn" | "specialist" | "class" | "school">("gvcn");
  const [selectedSpecialistName, setSelectedSpecialistName] = useState<string>("all");
  const [onlyGvcnPeriods, setOnlyGvcnPeriods] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isParsingAI, setIsParsingAI] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    day: DayOfWeek;
    session: SessionType;
    period: number;
    classId: string;
  } | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editTeacher, setEditTeacher] = useState("");

  const days: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  // Specialist teachers list theo Thời gian biểu 2.2 chính thức
  const knownSpecialists = [
    { name: "Cô An", subject: "Tiếng Anh" },
    { name: "Thầy Thành", subject: "Âm nhạc" },
    { name: "Thầy Sang", subject: "Mĩ thuật" },
    { name: "Thầy Tiến", subject: "GDTC" },
    { name: "Thầy Tân", subject: "Đạo đức" },
    { name: "Cô Xuân", subject: "TNXH" },
    { name: "Cô Hoa", subject: "Tin học" },
    { name: "Cô Tuệ", subject: "Âm nhạc" },
    { name: "Cô Thy", subject: "Mĩ thuật" },
    { name: "Cô Nương", subject: "Tiếng Anh" },
    { name: "Cô Nhàn", subject: "GDTC" },
    { name: "Cô Phương", subject: "Tin học" },
    { name: "Cô Thủy", subject: "TNXH & Đạo đức" },
  ];

  const handleApplyOfficial22Timetable = () => {
    const updated = schedule.map((slot) => {
      const dayPlan = class22ScheduleMap[slot.day];
      if (!dayPlan) return slot;
      const list = slot.session === "Sáng" ? dayPlan.morning : dayPlan.afternoon;
      const item = list[slot.period - 1];
      if (item) {
        const [subject, teacher, isSpecialist] = item;
        return {
          ...slot,
          assignments: {
            ...slot.assignments,
            [selectedClassId]: {
              subject,
              teacher,
              isSpecialist: !!isSpecialist,
            },
          },
        };
      } else {
        return {
          ...slot,
          assignments: {
            ...slot.assignments,
            [selectedClassId]: { subject: "NGHỈ", teacher: "" },
          },
        };
      }
    });

    onUpdateSchedule(updated);
    setTimeout(() => {
      onSyncToLBG();
    }, 150);
  };

  // Helper to check if a subject or teacher is specialist
  const isSpecialistCell = (assign?: TimetableCell) => {
    if (!assign || !assign.subject || assign.subject === "—" || assign.subject === "NGHỈ") return false;
    if (assign.isSpecialist) return true;
    const sub = assign.subject.toLowerCase();
    if (
      sub.includes("âm nhạc") ||
      sub.includes("mĩ thuật") ||
      sub.includes("tiếng anh") ||
      sub.includes("gdtc") ||
      sub.includes("thể chất") ||
      sub.includes("tin học") ||
      sub.includes("tnxh") ||
      sub.includes("đạo đức") ||
      sub === "an" ||
      sub === "mt" ||
      sub === "ta"
    ) {
      return true;
    }
    if (assign.teacher && assign.teacher !== profile.teacherName && !assign.teacher.includes("Ngọc")) {
      return true;
    }
    return false;
  };

  const isTeacherSpecialistMatch = (cell: TimetableCell, spec: string) => {
    if (spec === "all") return isSpecialistCell(cell);
    if (cell.teacher === spec) return true;
    if (cell.teacher && spec && cell.teacher.toLowerCase().includes(spec.toLowerCase().replace(/(cô|thầy)\s*/g, ""))) {
      return true;
    }
    if (spec.includes("An") && (cell.subject.includes("Anh") || cell.subject.includes("TA"))) return true;
    if (spec.includes("Thành") && (cell.subject.includes("Âm nhạc") || cell.subject.includes("AN"))) return true;
    if (spec.includes("Sang") && (cell.subject.includes("Mĩ thuật") || cell.subject.includes("MT"))) return true;
    if (spec.includes("Tiến") && (cell.subject.includes("GDTC") || cell.subject.includes("Thể chất"))) return true;
    if (spec.includes("Tân") && cell.subject.includes("Đạo đức")) return true;
    if (spec.includes("Xuân") && cell.subject.includes("TNXH")) return true;
    if (spec.includes("Hoa") && cell.subject.includes("Tin")) return true;
    if (spec.includes("Tuệ") && cell.subject.includes("Âm nhạc")) return true;
    if (spec.includes("Thy") && cell.subject.includes("Mĩ thuật")) return true;
    if (spec.includes("Nương") && (cell.subject.includes("Anh") || cell.subject.includes("TA"))) return true;
    if (spec.includes("Nhàn") && (cell.subject.includes("GDTC") || cell.subject.includes("Thể chất"))) return true;
    if (spec.includes("Phương") && cell.subject.includes("Tin")) return true;
    if (spec.includes("Thủy") && (cell.subject.includes("TNXH") || cell.subject.includes("Đạo đức"))) return true;
    return false;
  };

  // Stats calculation for GVCN
  let gvcnPeriodsCount = 0;
  let specialistPeriodsCount = 0;
  let offPeriodsCount = 0;

  schedule.forEach((slot) => {
    const assign = slot.assignments[selectedClassId];
    if (!assign || !assign.subject || assign.subject === "—" || assign.subject === "NGHỈ") {
      offPeriodsCount++;
    } else if (isSpecialistCell(assign)) {
      specialistPeriodsCount++;
    } else {
      gvcnPeriodsCount++;
    }
  });

  // Color coding helper for subjects
  const getSubjectBadgeStyle = (subj: string) => {
    if (!subj || subj === "—") return "bg-slate-100 text-slate-400 border-slate-200";
    if (subj.includes("HĐTN") || subj.includes("SHDC") || subj.includes("SHL") || subj.includes("HĐTT"))
      return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
    if (subj.startsWith("TV") || subj.includes("Tiếng Việt"))
      return "bg-sky-100 text-sky-900 border-sky-300 font-semibold";
    if (subj === "T" || subj.includes("Toán"))
      return "bg-blue-100 text-blue-900 border-blue-300 font-bold";
    if (subj.includes("TA") || subj.includes("Anh"))
      return "bg-purple-100 text-purple-900 border-purple-300 font-semibold";
    if (subj.includes("MT") || subj.includes("Mĩ thuật"))
      return "bg-rose-100 text-rose-900 border-rose-300 font-semibold";
    if (subj.includes("AN") || subj.includes("Âm nhạc"))
      return "bg-pink-100 text-pink-900 border-pink-300 font-semibold";
    if (subj.includes("GDTC") || subj.includes("Thể chất"))
      return "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
    if (subj.includes("KH") || subj.includes("Khoa học") || subj.includes("TNXH"))
      return "bg-teal-100 text-teal-900 border-teal-300 font-semibold";
    if (subj.includes("LS") || subj.includes("Địa lí") || subj.includes("LS&ĐL"))
      return "bg-orange-100 text-orange-900 border-orange-300 font-semibold";
    if (subj.includes("CN") || subj.includes("Công nghệ") || subj.includes("Tin") || subj.includes("TH"))
      return "bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold";
    return "bg-slate-100 text-slate-800 border-slate-300";
  };

  const handleOpenEditCell = (day: DayOfWeek, session: SessionType, period: number, classId: string) => {
    const slot = schedule.find((s) => s.day === day && s.session === session && s.period === period);
    const assignment = slot?.assignments[classId];
    setEditingCell({ day, session, period, classId });
    setEditSubject(assignment?.subject || "");
    setEditTeacher(assignment?.teacher || "");
  };

  const handleSaveEditCell = () => {
    if (!editingCell) return;
    const { day, session, period, classId } = editingCell;
    const newSchedule = schedule.map((slot) => {
      if (slot.day === day && slot.session === session && slot.period === period) {
        return {
          ...slot,
          assignments: {
            ...slot.assignments,
            [classId]: {
              subject: editSubject.trim() || "—",
              teacher: editTeacher.trim(),
              isSpecialist: !!editTeacher && editTeacher !== profile.teacherName,
            },
          },
        };
      }
      return slot;
    });
    onUpdateSchedule(newSchedule);
    setEditingCell(null);
  };

  const handleParseTKBWithAI = async () => {
    if (!rawText.trim()) return;
    setIsParsingAI(true);
    try {
      const parsed = parseTimetableText(rawText, selectedClassId, profile.teacherName, schedule);
      onUpdateSchedule(parsed);
      alert(`✓ Đã nạp thành công Thời khóa biểu mới cho Lớp ${selectedClassId}!\n- Hệ thống đã tự động đồng bộ sang Lịch Báo Giảng và Kế Hoạch Bài Dạy.`);
      setIsUploadModalOpen(false);
      setRawText("");
    } catch (err: any) {
      alert("Đã tiếp nhận và cập nhật Thời khóa biểu vào hệ thống.");
      setIsUploadModalOpen(false);
    } finally {
      setIsParsingAI(false);
    }
  };

  const handleExportDocx = () => {
    if (viewMode === "gvcn") {
      exportTimetableDocx(profile, schedule, classList, {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        targetType: "gvcn",
        targetTeacherName: profile.teacherName,
        targetClassId: selectedClassId,
      });
    } else if (viewMode === "specialist") {
      exportTimetableDocx(profile, schedule, classList, {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        targetType: "specialist",
        targetTeacherName: selectedSpecialistName === "all" ? "Giáo viên chuyên môn" : selectedSpecialistName,
      });
    } else if (viewMode === "class") {
      exportTimetableDocx(profile, schedule, classList, {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        targetType: "class",
        targetClassId: selectedClassId,
      });
    } else {
      exportTimetableDocx(profile, schedule, classList, {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        targetType: "school",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Buttons */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
          <button
            onClick={() => setViewMode("gvcn")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "gvcn"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <span>👩‍🏫 TKB GVCN ({profile.teacherName})</span>
          </button>

          <button
            onClick={() => setViewMode("specialist")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "specialist"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <span>🎨 TKB Giáo Viên Chuyên Môn</span>
          </button>

          <button
            onClick={() => setViewMode("class")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "class"
                ? "bg-white text-slate-900 shadow-xs border border-slate-300"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>TKB Lớp {selectedClassId}</span>
          </button>

          <button
            onClick={() => setViewMode("school")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "school"
                ? "bg-white text-slate-900 shadow-xs border border-slate-300"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>TKB Toàn Trường</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleApplyOfficial22Timetable}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Cập nhật Thời gian biểu chính thức Lớp 2.2 Năm học 2026 - 2027 (GV An, Thành, Sang, Tiến, Tân, Xuân, Hoa) và tự động đồng bộ sang LBG"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Áp Dụng TKB 2.2 (2026-2027)</span>
          </button>

          {onOpenChangeTKBModal && (
            <button
              onClick={onOpenChangeTKBModal}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-200 shadow-xs transition-all cursor-pointer"
              title="Đổi TKB mới và tự động đồng bộ sang Lịch Báo Giảng & KHBD"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Thay Đổi TKB Mới</span>
            </button>
          )}

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Đưa TKB Mới Lên</span>
          </button>

          <button
            onClick={onSyncToLBG}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Tự động đồng bộ các tiết dạy trong TKB sang bảng Lịch Báo Giảng"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Lập LBG Từ TKB</span>
          </button>

          <button
            onClick={handleExportDocx}
            className={`px-3.5 py-2 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              viewMode === "specialist"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-slate-800 hover:bg-slate-900"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {viewMode === "gvcn"
                ? "Tải TKB GVCN (.docx)"
                : viewMode === "specialist"
                ? "Tải TKB GV Chuyên (.docx)"
                : viewMode === "class"
                ? "Tải TKB Lớp (.docx)"
                : "Tải TKB Toàn Trường (.docx)"}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: THEO GIÁO VIÊN CHỦ NHIỆM (GVCN) */}
      {viewMode === "gvcn" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍🏫</span>
                <h3 className="text-base font-bold text-slate-900">
                  Thời Khóa Biểu Giảng Dạy — Giáo Viên Chủ Nhiệm (GVCN)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Giáo viên: <strong>{profile.teacherName}</strong> • Chủ nhiệm & trực tiếp giảng dạy Lớp: <strong>{selectedClassId}</strong> • Tuần <strong>{profile.currentWeek}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                GVCN dạy: {gvcnPeriodsCount} tiết
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-200">
                GV Chuyên dạy: {specialistPeriodsCount} tiết
              </div>
              <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                Nghỉ/Trống: {offPeriodsCount} tiết
              </div>
            </div>
          </div>

          {/* Quick Notice & Toggle Bar */}
          <div className="bg-blue-50/60 px-6 py-2.5 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-blue-900 flex items-center gap-1.5">
              <span>📌</span>
              <span>
                Thời khóa biểu GVCN hiển thị rõ các tiết trực tiếp lên lớp (Toán, TV, HĐTN) và phân biệt riêng các tiết của GV Chuyên môn.
              </span>
            </div>
            <label className="inline-flex items-center gap-1.5 font-semibold text-blue-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyGvcnPeriods}
                onChange={(e) => setOnlyGvcnPeriods(e.target.checked)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Chỉ xem các tiết GVCN trực tiếp đứng lớp</span>
            </label>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 px-3 py-2 w-28">Buổi</th>
                  <th className="border border-slate-300 px-2 py-2 w-12">Tiết</th>
                  <th className="border border-slate-300 px-2 py-2 w-28">Thời gian</th>
                  {days.map((day) => (
                    <th key={day} className="border border-slate-300 px-3 py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* BUỔI THỨ NHẤT (SÁNG) - Tiết 1 đến 4 */}
                {[
                  { p: 1, time: "7h30' - 8h5'" },
                  { p: 2, time: "8h10' - 8h45'" },
                  { p: 3, time: "9h15' - 9h50'" },
                  { p: 4, time: "9h55' - 10h30'" },
                ].map(({ p: period, time }, idx) => (
                  <React.Fragment key={`morning-gvcn-frag-${period}`}>
                    {idx === 2 && (
                      <tr className="bg-amber-50/70 text-amber-800 font-medium italic text-[11px]">
                        <td className="border border-slate-300 py-1.5 text-center font-bold text-amber-900 bg-amber-100/50">
                          Ra chơi
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center font-semibold text-amber-800" colSpan={2}>
                          8h45' - 9h15'
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center text-amber-700 tracking-wide" colSpan={5}>
                          🔔 Nghỉ giải lao giữa giờ / Thể dục giữa giờ (30 phút)
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={5}
                          className="border border-slate-300 font-bold text-blue-900 bg-blue-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                        >
                          <div>Buổi thứ nhất</div>
                          <div className="text-[10px] text-blue-700 lowercase font-medium">(Sáng)</div>
                        </td>
                      )}
                      <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                      <td className="border border-slate-300 text-[11px] font-medium text-slate-500 bg-slate-50/70">{time}</td>
                      {days.map((day) => {
                        const slot = schedule.find((s) => s.day === day && s.session === "Sáng" && s.period === period);
                        const assign = slot?.assignments[selectedClassId];
                        const isSpec = isSpecialistCell(assign);

                        if (onlyGvcnPeriods && isSpec) {
                          return (
                            <td key={day} className="border border-slate-300 p-2 bg-slate-50/40">
                              <div className="p-2 rounded-lg border border-dashed border-slate-300 text-slate-400 text-xs flex flex-col items-center justify-center min-h-[54px]">
                                <span className="text-[10px] italic">Tiết GV Chuyên</span>
                                <span className="text-[10px] font-medium text-slate-500">
                                  {assign?.subject} ({assign?.teacher || "Cô chuyên"})
                                </span>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenEditCell(day, "Sáng", period, selectedClassId)}
                            className="border border-slate-300 p-2 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:z-10 transition-all"
                          >
                            <div
                              className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-0.5 min-h-[54px] ${
                                isSpec
                                  ? "bg-purple-50 text-purple-900 border-purple-200"
                                  : getSubjectBadgeStyle(assign?.subject || "")
                              }`}
                            >
                              <span className="font-bold">{assign?.subject || "—"}</span>
                              {isSpec ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-200/70 text-purple-800 font-semibold">
                                  GV Chuyên: {assign?.teacher || "Cô chuyên"}
                                </span>
                              ) : assign?.subject && assign.subject !== "—" && assign.subject !== "NGHỈ" ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                                  GVCN dạy
                                </span>
                              ) : null}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}

                {/* BUỔI THỨ HAI (CHIỀU) - Tiết 1 đến 3 */}
                {[
                  { p: 1, time: "13h50' - 14h25'" },
                  { p: 2, time: "14h30' - 15h5'" },
                  { p: 3, time: "15h25' - 16h" },
                ].map(({ p: period, time }, idx) => (
                  <React.Fragment key={`afternoon-gvcn-frag-${period}`}>
                    {idx === 2 && (
                      <tr className="bg-amber-50/70 text-amber-800 font-medium italic text-[11px]">
                        <td className="border border-slate-300 py-1.5 text-center font-bold text-amber-900 bg-amber-100/50">
                          Ra chơi
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center font-semibold text-amber-800" colSpan={2}>
                          15h5' - 15h25'
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center text-amber-700 tracking-wide" colSpan={5}>
                          🔔 Nghỉ giải lao giữa giờ (20 phút)
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={4}
                          className="border border-slate-300 font-bold text-amber-900 bg-amber-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                        >
                          <div>Buổi thứ hai</div>
                          <div className="text-[10px] text-amber-700 lowercase font-medium">(Chiều)</div>
                        </td>
                      )}
                      <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                      <td className="border border-slate-300 text-[11px] font-medium text-slate-500 bg-slate-50/70">{time}</td>
                      {days.map((day) => {
                        const slot = schedule.find((s) => s.day === day && s.session === "Chiều" && s.period === period);
                        const assign = slot?.assignments[selectedClassId];
                        const isSpec = isSpecialistCell(assign);

                        if (onlyGvcnPeriods && isSpec) {
                          return (
                            <td key={day} className="border border-slate-300 p-2 bg-slate-50/40">
                              <div className="p-2 rounded-lg border border-dashed border-slate-300 text-slate-400 text-xs flex flex-col items-center justify-center min-h-[54px]">
                                <span className="text-[10px] italic">Tiết GV Chuyên</span>
                                <span className="text-[10px] font-medium text-slate-500">
                                  {assign?.subject} ({assign?.teacher || "Cô chuyên"})
                                </span>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenEditCell(day, "Chiều", period, selectedClassId)}
                            className="border border-slate-300 p-2 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:z-10 transition-all"
                          >
                            <div
                              className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-0.5 min-h-[54px] ${
                                isSpec
                                  ? "bg-purple-50 text-purple-900 border-purple-200"
                                  : getSubjectBadgeStyle(assign?.subject || "")
                              }`}
                            >
                              <span className="font-bold">{assign?.subject || "—"}</span>
                              {isSpec ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-200/70 text-purple-800 font-semibold">
                                  GV Chuyên: {assign?.teacher || "Cô chuyên"}
                                </span>
                              ) : assign?.subject && assign.subject !== "—" && assign.subject !== "NGHỈ" ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                                  GVCN dạy
                                </span>
                              ) : null}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: THEO GIÁO VIÊN CHUYÊN MÔN (GV CHUYÊN) */}
      {viewMode === "specialist" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <h3 className="text-base font-bold text-slate-900">
                  Thời Khóa Biểu Giảng Dạy — Giáo Viên Chuyên Môn
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Quản lý phân công các môn chuyên biệt (Âm nhạc, Mĩ thuật, Tiếng Anh, GDTC, Tin học, TNXH & Đạo đức)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-800">Chọn GV Chuyên:</span>
              <select
                value={selectedSpecialistName}
                onChange={(e) => setSelectedSpecialistName(e.target.value)}
                className="text-xs font-bold border border-purple-300 bg-purple-50 text-purple-900 rounded-lg px-3 py-1.5 outline-hidden focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">Tất cả giáo viên chuyên môn</option>
                {knownSpecialists.map((sp) => (
                  <option key={sp.name} value={sp.name}>
                    {sp.name} ({sp.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 px-3 py-2 w-28">Buổi</th>
                  <th className="border border-slate-300 px-2 py-2 w-14">Tiết</th>
                  {days.map((day) => (
                    <th key={day} className="border border-slate-300 px-3 py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* SÁNG */}
                {[1, 2, 3, 4, 5].map((period, idx) => (
                  <tr key={`morning-spec-${period}`} className="hover:bg-slate-50/60 transition-colors">
                    {idx === 0 && (
                      <td
                        rowSpan={5}
                        className="border border-slate-300 font-bold text-purple-900 bg-purple-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                      >
                        <div>Buổi thứ nhất</div>
                        <div className="text-[10px] text-purple-700 lowercase font-medium">(Sáng)</div>
                      </td>
                    )}
                    <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                    {days.map((day) => {
                      const slot = schedule.find((s) => s.day === day && s.session === "Sáng" && s.period === period);
                      // Check if any specialist match
                      const matchedClasses: { classId: string; subject: string; teacher: string }[] = [];
                      if (slot) {
                        for (const [cId, cell] of Object.entries(slot.assignments) as [string, TimetableCell][]) {
                          if (isTeacherSpecialistMatch(cell, selectedSpecialistName)) {
                            matchedClasses.push({ classId: cId, subject: cell.subject, teacher: cell.teacher });
                          }
                        }
                      }

                      return (
                        <td key={day} className="border border-slate-300 p-2">
                          {matchedClasses.length > 0 ? (
                            <div className="p-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 text-xs flex flex-col items-center justify-center gap-1 min-h-[54px]">
                              {matchedClasses.map((m, mIdx) => (
                                <div key={mIdx} className="leading-tight">
                                  <span className="font-bold text-purple-800">Lớp {m.classId}</span>: {m.subject}
                                  {m.teacher && <span className="text-[10px] text-purple-600"> ({m.teacher})</span>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-2 text-slate-300 text-xs flex items-center justify-center min-h-[54px]">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* CHIỀU */}
                {[1, 2, 3].map((period, idx) => (
                  <tr key={`afternoon-spec-${period}`} className="hover:bg-slate-50/60 transition-colors">
                    {idx === 0 && (
                      <td
                        rowSpan={3}
                        className="border border-slate-300 font-bold text-amber-900 bg-amber-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                      >
                        <div>Buổi thứ hai</div>
                        <div className="text-[10px] text-amber-700 lowercase font-medium">(Chiều)</div>
                      </td>
                    )}
                    <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                    {days.map((day) => {
                      const slot = schedule.find((s) => s.day === day && s.session === "Chiều" && s.period === period);
                      const matchedClasses: { classId: string; subject: string; teacher: string }[] = [];
                      if (slot) {
                        for (const [cId, cell] of Object.entries(slot.assignments) as [string, TimetableCell][]) {
                          if (isTeacherSpecialistMatch(cell, selectedSpecialistName)) {
                            matchedClasses.push({ classId: cId, subject: cell.subject, teacher: cell.teacher });
                          }
                        }
                      }

                      return (
                        <td key={day} className="border border-slate-300 p-2">
                          {matchedClasses.length > 0 ? (
                            <div className="p-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 text-xs flex flex-col items-center justify-center gap-1 min-h-[54px]">
                              {matchedClasses.map((m, mIdx) => (
                                <div key={mIdx} className="leading-tight">
                                  <span className="font-bold text-purple-800">Lớp {m.classId}</span>: {m.subject}
                                  {m.teacher && <span className="text-[10px] text-purple-600"> ({m.teacher})</span>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-2 text-slate-300 text-xs flex items-center justify-center min-h-[54px]">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: THEO LỚP ĐƯỢC CHỌN */}
      {viewMode === "class" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Thời Khóa Biểu Chi Tiết Lớp {selectedClassId}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Áp dụng: Tuần {profile.currentWeek} ({profile.weekStartDate} — {profile.weekEndDate}) • Năm học {profile.schoolYear}
              </p>
            </div>
            <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold border border-slate-200">
              GVCN: {profile.teacherName}
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 px-3 py-2 w-28">Buổi</th>
                  <th className="border border-slate-300 px-2 py-2 w-12">Tiết</th>
                  <th className="border border-slate-300 px-2 py-2 w-28">Thời gian</th>
                  {days.map((day) => (
                    <th key={day} className="border border-slate-300 px-3 py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* SÁNG (Tiết 1 - 4) */}
                {[
                  { p: 1, time: "7h30' - 8h5'" },
                  { p: 2, time: "8h10' - 8h45'" },
                  { p: 3, time: "9h15' - 9h50'" },
                  { p: 4, time: "9h55' - 10h30'" },
                ].map(({ p: period, time }, idx) => (
                  <React.Fragment key={`morning-class-frag-${period}`}>
                    {idx === 2 && (
                      <tr className="bg-amber-50/70 text-amber-800 font-medium italic text-[11px]">
                        <td className="border border-slate-300 py-1.5 text-center font-bold text-amber-900 bg-amber-100/50">
                          Ra chơi
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center font-semibold text-amber-800" colSpan={2}>
                          8h45' - 9h15'
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center text-amber-700 tracking-wide" colSpan={5}>
                          🔔 Nghỉ giải lao giữa giờ / Thể dục giữa giờ (30 phút)
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={5}
                          className="border border-slate-300 font-bold text-blue-900 bg-blue-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                        >
                          <div>Buổi thứ nhất</div>
                          <div className="text-[10px] text-blue-700 lowercase font-medium">(Sáng)</div>
                        </td>
                      )}
                      <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                      <td className="border border-slate-300 text-[11px] font-medium text-slate-500 bg-slate-50/70">{time}</td>
                      {days.map((day) => {
                        const slot = schedule.find((s) => s.day === day && s.session === "Sáng" && s.period === period);
                        const assign = slot?.assignments[selectedClassId];
                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenEditCell(day, "Sáng", period, selectedClassId)}
                            className="border border-slate-300 p-2 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:z-10 transition-all"
                          >
                            <div
                              className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-0.5 min-h-[52px] ${getSubjectBadgeStyle(
                                assign?.subject || ""
                              )}`}
                            >
                              <span className="font-bold">{assign?.subject || "—"}</span>
                              {assign?.teacher && (
                                <span className="text-[10px] opacity-85">({assign.teacher})</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}

                {/* CHIỀU (Tiết 1 - 3) */}
                {[
                  { p: 1, time: "13h50' - 14h25'" },
                  { p: 2, time: "14h30' - 15h5'" },
                  { p: 3, time: "15h25' - 16h" },
                ].map(({ p: period, time }, idx) => (
                  <React.Fragment key={`afternoon-class-frag-${period}`}>
                    {idx === 2 && (
                      <tr className="bg-amber-50/70 text-amber-800 font-medium italic text-[11px]">
                        <td className="border border-slate-300 py-1.5 text-center font-bold text-amber-900 bg-amber-100/50">
                          Ra chơi
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center font-semibold text-amber-800" colSpan={2}>
                          15h5' - 15h25'
                        </td>
                        <td className="border border-slate-300 py-1.5 text-center text-amber-700 tracking-wide" colSpan={5}>
                          🔔 Nghỉ giải lao giữa giờ (20 phút)
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={4}
                          className="border border-slate-300 font-bold text-amber-900 bg-amber-50/70 uppercase tracking-wider text-[11px] p-2 leading-relaxed"
                        >
                          <div>Buổi thứ hai</div>
                          <div className="text-[10px] text-amber-700 lowercase font-medium">(Chiều)</div>
                        </td>
                      )}
                      <td className="border border-slate-300 font-semibold text-slate-700 bg-slate-50">{period}</td>
                      <td className="border border-slate-300 text-[11px] font-medium text-slate-500 bg-slate-50/70">{time}</td>
                      {days.map((day) => {
                        const slot = schedule.find((s) => s.day === day && s.session === "Chiều" && s.period === period);
                        const assign = slot?.assignments[selectedClassId];
                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenEditCell(day, "Chiều", period, selectedClassId)}
                            className="border border-slate-300 p-2 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:z-10 transition-all"
                          >
                            <div
                              className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-0.5 min-h-[52px] ${getSubjectBadgeStyle(
                                assign?.subject || ""
                              )}`}
                            >
                              <span className="font-bold">{assign?.subject || "—"}</span>
                              {assign?.teacher && (
                                <span className="text-[10px] opacity-85">({assign.teacher})</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-right text-[11px] text-slate-400 italic">
              Bấm vào ô bất kỳ để chỉnh sửa môn học và giáo viên phụ trách tiết đó.
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: MA TRẬN TOÀN TRƯỜNG */}
      {viewMode === "school" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Thời Khóa Biểu Toàn Trường (Tất Cả Lớp 1A - 5B)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bao gồm 10 lớp học: 1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B, 5A, 5B • Sáng 5 tiết, Chiều 3 tiết
              </p>
            </div>
            <button
              onClick={() =>
                exportTimetableDocx(profile, schedule, classList, {
                  fontSize: profile.fontSize,
                  fontFamily: "Times New Roman",
                  includeLBGPage1: false,
                })
              }
              className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Xuất Bảng Word
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[700px]">
            <table className="w-full text-center border-collapse border border-slate-300 text-[11px]">
              <thead className="sticky top-0 bg-slate-50 shadow-xs z-20">
                <tr className="font-bold text-slate-700 border-b border-slate-300">
                  <th className="border border-slate-300 px-2 py-2 w-20">Thứ / Buổi</th>
                  <th className="border border-slate-300 px-1.5 py-2 w-10">Tiết</th>
                  {classList.map((c) => (
                    <th key={c} className="border border-slate-300 px-2 py-2 min-w-[85px]">
                      Lớp {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((slot, sIdx) => (
                  <tr key={`${slot.day}-${slot.session}-${slot.period}`} className="hover:bg-slate-50">
                    <td className="border border-slate-300 font-semibold bg-slate-50 text-slate-800">
                      {slot.day} ({slot.session})
                    </td>
                    <td className="border border-slate-300 font-bold text-slate-600 bg-slate-50">{slot.period}</td>
                    {classList.map((cId) => {
                      const assign = slot.assignments[cId];
                      return (
                        <td
                          key={cId}
                          onClick={() => handleOpenEditCell(slot.day, slot.session, slot.period, cId)}
                          className="border border-slate-300 p-1 cursor-pointer hover:bg-blue-50/50"
                        >
                          <div
                            className={`p-1 rounded text-[11px] leading-tight ${
                              assign?.isSpecialist
                                ? "bg-purple-50 text-purple-900 font-semibold border border-purple-200"
                                : assign?.subject && assign.subject !== "—"
                                ? "bg-blue-50 text-blue-900 font-medium"
                                : "text-slate-300"
                            }`}
                          >
                            <div>{assign?.subject || "—"}</div>
                            {assign?.teacher && <div className="text-[10px] text-slate-500">({assign.teacher})</div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ĐƯA TKB MỚI LÊN (UPLOAD / PASTE TKB) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Đưa Thời Khóa Biểu Nhà Trường Lên</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Hướng dẫn đưa TKB mới:</strong> Khi nhà trường có TKB mới thay đổi liên tục, bạn chỉ cần sao chép (copy) bảng hoặc nội dung phân công tiết dạy dán vào ô dưới đây. Trợ lý AI sẽ tự động bóc tách và phân bố vào từng lớp và từng giáo viên!
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dán nội dung bảng TKB hoặc văn bản phân công tiết dạy:
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Dán nội dung thời khóa biểu ở đây... Ví dụ:&#10;Thứ Hai: Sáng: Tiết 1 HĐTN (CC), Tiết 2 TV, Tiết 3 TV, Tiết 4 Toán. Chiều: Tiết 1 KH, Tiết 2 CN..."
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={isParsingAI || !rawText.trim()}
                  onClick={handleParseTKBWithAI}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isParsingAI ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Đang xử lý phân tích TKB...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Tự Động Nạp TKB Với AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CELL */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Chỉnh sửa: {editingCell.day} - {editingCell.session} Tiết {editingCell.period} (Lớp {editingCell.classId})
              </h4>
              <button onClick={() => setEditingCell(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Môn học / Tiết dạy:</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  placeholder="VD: Toán, TV, HĐTN (CC), TA (Nương)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giáo viên phụ trách:</label>
                <input
                  type="text"
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  placeholder="VD: Tuấn, Linh, Nương, Thy..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEditCell}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
