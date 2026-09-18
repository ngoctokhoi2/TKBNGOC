import React, { useState } from "react";
import {
  SchoolProfile,
  TimetableSlot,
  TimetableCell,
  TeacherInfo,
  DayOfWeek,
  SessionType,
  GradeLevel,
} from "../types";
import {
  Calendar,
  Upload,
  RefreshCw,
  Sparkles,
  Check,
  X,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  BookOpen,
} from "lucide-react";
import { parseTimetableText, standardizeSubjectName } from "../utils/timetableParser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  currentSchedule: TimetableSlot[];
  teachers: TeacherInfo[];
  classList: string[];
  selectedClassId: string;
  onApplyNewTimetable: (
    newSchedule: TimetableSlot[],
    updatedTeachers: TeacherInfo[],
    targetClassId: string
  ) => void;
}

export const ChangeTimetableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  currentSchedule,
  teachers,
  classList,
  selectedClassId,
  onApplyNewTimetable,
}) => {
  const [activeTab, setActiveTab] = useState<"preset" | "paste" | "visual">("preset");
  const [selectedPresetGrade, setSelectedPresetGrade] = useState<GradeLevel>(profile.grade || 2);
  const [targetClass, setTargetClass] = useState<string>(selectedClassId);
  const [rawText, setRawText] = useState("");
  const [editedSchedule, setEditedSchedule] = useState<TimetableSlot[]>(currentSchedule);
  const [tempTeachers, setTempTeachers] = useState<TeacherInfo[]>(teachers);
  const [syncLBG, setSyncLBG] = useState(true);
  const [syncKHBD, setSyncKHBD] = useState(true);
  const [syncTeachers, setSyncTeachers] = useState(true);

  if (!isOpen) return null;

  const days: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  // Helper to generate standard compliant 2-session timetable for a grade
  const generatePresetScheduleForClass = (grade: GradeLevel, classId: string): TimetableSlot[] => {
    const defaultGVCN = tempTeachers.find((t) => t.assignedClass === classId)?.shortName || profile.teacherName || "Ngọc";
    const gvTA = tempTeachers.find((t) => t.subjectSpecialty === "Tiếng Anh")?.shortName || "Nương";
    const gvTH = tempTeachers.find((t) => t.subjectSpecialty === "Tin học")?.shortName || "Phương";
    const gvAN = tempTeachers.find((t) => t.subjectSpecialty === "Âm nhạc")?.shortName || "Tuệ";
    const gvMT = tempTeachers.find((t) => t.subjectSpecialty === "Mĩ thuật")?.shortName || "Thy";
    const gvGDTC = tempTeachers.find((t) => t.subjectSpecialty === "GDTC")?.shortName || "Nhàn";

    // Standard subject distributions per grade
    const gradeTemplates: Record<GradeLevel, Record<DayOfWeek, { morning: [string, string][]; afternoon: [string, string][] }>> = {
      1: {
        "Thứ Hai": {
          morning: [["HĐTN (Sinh hoạt dưới cờ)", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["Tiếng Việt (T.cường)", defaultGVCN], ["GDTC", gvGDTC], ["Đạo đức", defaultGVCN]],
        },
        "Thứ Ba": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["TNXH", defaultGVCN]],
          afternoon: [["Âm nhạc", gvAN], ["Toán (T.cường)", defaultGVCN], ["HĐTT", defaultGVCN]],
        },
        "Thứ Tư": {
          morning: [["HĐTN", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["Mĩ thuật", gvMT], ["GDTC", gvGDTC], ["Tự học", defaultGVCN]],
        },
        "Thứ Năm": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["TNXH", defaultGVCN]],
          afternoon: [["Tiếng Việt (Bồi dưỡng)", defaultGVCN], ["SH Chuyên môn", defaultGVCN], ["SH Chuyên môn", defaultGVCN]],
        },
        "Thứ Sáu": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["HĐTN (Sinh hoạt lớp)", defaultGVCN]],
          afternoon: [["Toán (Bồi dưỡng)", defaultGVCN], ["Kĩ năng sống", defaultGVCN], ["Tự quản", defaultGVCN]],
        },
      },
      2: {
        "Thứ Hai": {
          morning: [["CC", "Ngọc"], ["Toán", "Ngọc"], ["Tiếng Việt", "Ngọc"], ["Tiếng Việt", "Ngọc"]],
          afternoon: [["AN", "Thành"], ["TNXH", "Xuân"], ["TNXH", "Xuân"]],
        },
        "Thứ Ba": {
          morning: [["Toán", "Ngọc"], ["HĐTN", "Ngọc"], ["Tiếng Việt", "Ngọc"], ["Tiếng Việt", "Ngọc"]],
          afternoon: [["Tiếng Việt", "Ngọc"], ["Tiếng Việt", "Ngọc"], ["Toán", "Ngọc"]],
        },
        "Thứ Tư": {
          morning: [["Tiếng Anh", "Cô An"], ["Tiếng Anh", "Cô An"], ["Tiếng Việt", "Ngọc"], ["Tiếng Việt", "Ngọc"]],
          afternoon: [["Tiếng Việt", "Ngọc"], ["Tiếng Việt", "Ngọc"], ["Toán", "Ngọc"]],
        },
        "Thứ Năm": {
          morning: [["Đạo đức", "Tân"], ["AN", "Thành"], ["Toán", "Ngọc"], ["HĐTN", "Ngọc"]],
          afternoon: [["GDTC", "Tiến"], ["Tin học", "Hoa"], ["Tin học", "Hoa"]],
        },
        "Thứ Sáu": {
          morning: [["MT", "Sang"], ["GDTC", "Tiến"], ["Toán (Tăng cường)", "Ngọc"], ["NGHỈ", "Ngọc"]],
          afternoon: [["NGHỈ", ""], ["NGHỈ", ""], ["NGHỈ", "Ngọc"]],
        },
      },
      3: {
        "Thứ Hai": {
          morning: [["HĐTN (Sinh hoạt dưới cờ)", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Tin học", gvTH], ["Đạo đức", defaultGVCN]],
        },
        "Thứ Ba": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["TNXH", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Công nghệ", defaultGVCN], ["GDTC", gvGDTC]],
        },
        "Thứ Tư": {
          morning: [["HĐTN", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["Âm nhạc", gvAN]],
          afternoon: [["Tiếng Anh", gvTA], ["Mĩ thuật", gvMT], ["HĐTT", defaultGVCN]],
        },
        "Thứ Năm": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["TNXH", defaultGVCN]],
          afternoon: [["Tin học", gvTH], ["SH Chuyên môn", defaultGVCN], ["SH Chuyên môn", defaultGVCN]],
        },
        "Thứ Sáu": {
          morning: [["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["GDTC", gvGDTC], ["HĐTN (Sinh hoạt lớp)", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Toán (Bồi dưỡng)", defaultGVCN], ["Tự quản", defaultGVCN]],
        },
      },
      4: {
        "Thứ Hai": {
          morning: [["HĐTN (Sinh hoạt dưới cờ)", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Khoa học", defaultGVCN], ["Đạo đức", defaultGVCN]],
        },
        "Thứ Ba": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["Lịch sử & Địa lí", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Tin học", gvTH], ["GDTC", gvGDTC]],
        },
        "Thứ Tư": {
          morning: [["HĐTN", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["Âm nhạc", gvAN]],
          afternoon: [["Tiếng Anh", gvTA], ["Mĩ thuật", gvMT], ["Công nghệ", defaultGVCN]],
        },
        "Thứ Năm": {
          morning: [["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["Khoa học", defaultGVCN]],
          afternoon: [["Lịch sử & Địa lí", defaultGVCN], ["SH Chuyên môn", defaultGVCN], ["SH Chuyên môn", defaultGVCN]],
        },
        "Thứ Sáu": {
          morning: [["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["GDTC", gvGDTC], ["HĐTN (Sinh hoạt lớp)", defaultGVCN]],
          afternoon: [["Tiếng Anh", gvTA], ["Tin học", gvTH], ["Tiếng Việt (Bồi dưỡng)", defaultGVCN]],
        },
      },
      5: {
        "Thứ Hai": {
          morning: [["HĐTN (Sinh hoạt dưới cờ)", defaultGVCN], ["Toán", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Tiếng Việt", defaultGVCN]],
          afternoon: [["Khoa học", defaultGVCN], ["Lịch sử & Địa lí", defaultGVCN], ["Đạo đức", defaultGVCN]],
        },
        "Thứ Ba": {
          morning: [["Tiếng Anh", gvTA], ["Tiếng Anh", gvTA], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["Mĩ thuật", gvMT], ["GDTC", gvGDTC], ["Tin học", gvTH]],
        },
        "Thứ Tư": {
          morning: [["HĐTN", defaultGVCN], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["Âm nhạc", gvAN]],
          afternoon: [["Khoa học", defaultGVCN], ["Lịch sử & Địa lí", defaultGVCN], ["Công nghệ", defaultGVCN]],
        },
        "Thứ Năm": {
          morning: [["Tiếng Anh", gvTA], ["Tiếng Anh", gvTA], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN]],
          afternoon: [["GDTC", gvGDTC], ["SH Chuyên môn", defaultGVCN], ["SH Chuyên môn", defaultGVCN]],
        },
        "Thứ Sáu": {
          morning: [["Tin học", gvTH], ["Tiếng Việt", defaultGVCN], ["Toán", defaultGVCN], ["HĐTN (Sinh hoạt lớp)", defaultGVCN]],
          afternoon: [["Toán (Bồi dưỡng)", defaultGVCN], ["Tiếng Việt (Bồi dưỡng)", defaultGVCN], ["Sinh hoạt Sao / Đội", defaultGVCN]],
        },
      },
    };

    const template = gradeTemplates[grade] || gradeTemplates[2];
    const newSlots: TimetableSlot[] = [];

    for (const day of days) {
      const dayData = template[day];
      // Sáng (Periods 1 to 4)
      for (let p = 1; p <= 4; p++) {
        const item = dayData.morning[p - 1] || ["Tự học", defaultGVCN];
        const isSpec = item[1] !== defaultGVCN;
        newSlots.push({
          day,
          session: "Sáng",
          period: p,
          assignments: {
            [classId]: {
              subject: item[0],
              teacher: item[1],
              isSpecialist: isSpec,
            },
          },
        });
      }
      // Chiều (Periods 1 to 3)
      for (let p = 1; p <= 3; p++) {
        const item = dayData.afternoon[p - 1] || ["Tự học", defaultGVCN];
        const isSpec = item[1] !== defaultGVCN;
        newSlots.push({
          day,
          session: "Chiều",
          period: p,
          assignments: {
            [classId]: {
              subject: item[0],
              teacher: item[1],
              isSpecialist: isSpec,
            },
          },
        });
      }
    }

    // Merge with other classes from currentSchedule
    return currentSchedule.map((slot) => {
      const newSlot = newSlots.find(
        (ns) => ns.day === slot.day && ns.session === slot.session && ns.period === slot.period
      );
      if (newSlot && newSlot.assignments[classId]) {
        return {
          ...slot,
          assignments: {
            ...slot.assignments,
            [classId]: newSlot.assignments[classId],
          },
        };
      }
      return slot;
    });
  };

  const handleApply = () => {
    let finalSchedule = editedSchedule;

    if (activeTab === "preset") {
      finalSchedule = generatePresetScheduleForClass(selectedPresetGrade, targetClass);
    } else if (activeTab === "paste" && rawText.trim()) {
      finalSchedule = parseTimetableText(
        rawText,
        targetClass,
        profile.teacherName,
        currentSchedule
      );
    }

    onApplyNewTimetable(finalSchedule, tempTeachers, targetClass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Thay Đổi Thời Khóa Biểu Mới & Tự Động Đồng Bộ
              </h3>
              <p className="text-xs text-slate-500">
                Tự động đồng bộ: <strong>Thời Khóa Biểu (TKB)</strong> ➔ <strong>Lịch Báo Giảng (LBG)</strong> ➔ <strong>Kế Hoạch Bài Dạy (KHBD)</strong> ➔ <strong>Phân Công Giáo Viên</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Target Class and Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lớp áp dụng TKB mới:
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none"
              >
                {classList.map((c) => (
                  <option key={c} value={c}>
                    Lớp {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cách thức nhập / thay đổi TKB:
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("preset")}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "preset"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Mẫu TKB Chuẩn Khối {selectedPresetGrade}
                </button>

                <button
                  onClick={() => setActiveTab("paste")}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "paste"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Dán Văn Bản TKB Mới
                </button>

                <button
                  onClick={() => setActiveTab("visual")}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "visual"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Chỉnh Sửa Trực Tiếp
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: PRESET STANDARD TIMETABLE */}
          {activeTab === "preset" && (
            <div className="space-y-4 border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Chọn Khối Học Để Nạp Khung TKB Chuẩn 7 Tiết/Ngày:
                </span>
                <div className="flex items-center gap-1">
                  {([1, 2, 3, 4, 5] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedPresetGrade(g)}
                      className={`px-3 py-1 text-xs font-bold rounded-md border cursor-pointer ${
                        selectedPresetGrade === g
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Khối {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md text-xs text-slate-600 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mẫu TKB Chuẩn Khối {selectedPresetGrade} bao gồm:
                </div>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Buổi Sáng (4-5 tiết)</strong>: Tiếng Việt, Toán, HĐTN (Sinh hoạt dưới cờ), Tin học/T.cường, Âm nhạc, Mĩ thuật.<br />
                  • <strong>Buổi Chiều (2-3 tiết)</strong>: Tiếng Việt (Viết/Luyện), TNXH / Khoa học, GDTC, Đạo đức, Bồi dưỡng / Tự học.<br />
                  • Tự động phân chia giáo viên bộ môn chuyên: <strong>Cô Nương (Tiếng Anh)</strong>, <strong>Cô Phương (Tin học)</strong>, <strong>Cô Tuệ (Âm nhạc)</strong>, <strong>Cô Thy (Mĩ thuật)</strong>, <strong>Cô Nhàn (GDTC)</strong> và <strong>{profile.teacherName} (GVCN)</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE RAW TEXT */}
          {activeTab === "paste" && (
            <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
              <label className="block text-xs font-bold text-slate-800">
                Dán bảng TKB hoặc văn bản phân công tiết dạy từ nhà trường:
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Dán nội dung thời khóa biểu mới ở đây... Ví dụ:&#10;Thứ Hai: Sáng: Tiết 1 HĐTN, Tiết 2 Tiếng Việt, Tiết 3 Tiếng Việt, Tiết 4 Toán. Chiều: Tiết 1 Tiếng Việt (Viết), Tiết 2 GDTC (Nhàn), Tiết 3 Đạo đức...&#10;Thứ Ba: Sáng: Tiết 1 Tin học (Phương), Tiết 2 Tiếng Việt..."
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 italic">
                Hệ thống tự động phát hiện Thứ, Buổi (Sáng/Chiều), Tiết và Tên giáo viên trong ngoặc đơn.
              </p>
            </div>
          )}

          {/* TAB 3: VISUAL MATRIX */}
          {activeTab === "visual" && (
            <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Ma Trận Thời Khóa Biểu Lớp {targetClass}:</span>
                <span className="text-[11px] text-slate-500 font-normal">Nhập trực tiếp môn học và GV phụ trách</span>
              </div>

              <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-center border-collapse border border-slate-300 text-xs">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="font-bold text-slate-700 border-b border-slate-300">
                      <th className="border border-slate-300 px-2 py-1.5 w-16">Buổi</th>
                      <th className="border border-slate-300 px-1 py-1.5 w-10">Tiết</th>
                      {days.map((d) => (
                        <th key={d} className="border border-slate-300 px-2 py-1.5">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sáng 1 - 4 */}
                    {[1, 2, 3, 4].map((p, idx) => (
                      <tr key={`m-${p}`} className="hover:bg-slate-50">
                        {idx === 0 && (
                          <td rowSpan={4} className="border border-slate-300 font-bold text-slate-700 bg-slate-50 text-[11px]">
                            Sáng
                          </td>
                        )}
                        <td className="border border-slate-300 font-semibold">{p}</td>
                        {days.map((day) => {
                          const slot = editedSchedule.find((s) => s.day === day && s.session === "Sáng" && s.period === p);
                          const cell = slot?.assignments[targetClass];
                          return (
                            <td key={day} className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={cell?.subject || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditedSchedule((prev) =>
                                    prev.map((s) => {
                                      if (s.day === day && s.session === "Sáng" && s.period === p) {
                                        return {
                                          ...s,
                                          assignments: {
                                            ...s.assignments,
                                            [targetClass]: {
                                              subject: val,
                                              teacher: cell?.teacher || profile.teacherName,
                                              isSpecialist: cell?.isSpecialist || false,
                                            },
                                          },
                                        };
                                      }
                                      return s;
                                    })
                                  );
                                }}
                                className="w-full px-1.5 py-1 text-center font-semibold text-[11px] border border-slate-200 rounded focus:border-blue-500 outline-none"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Chiều 1 - 3 */}
                    {[1, 2, 3].map((p, idx) => (
                      <tr key={`a-${p}`} className="hover:bg-slate-50">
                        {idx === 0 && (
                          <td rowSpan={3} className="border border-slate-300 font-bold text-slate-700 bg-slate-50 text-[11px]">
                            Chiều
                          </td>
                        )}
                        <td className="border border-slate-300 font-semibold">{p}</td>
                        {days.map((day) => {
                          const slot = editedSchedule.find((s) => s.day === day && s.session === "Chiều" && s.period === p);
                          const cell = slot?.assignments[targetClass];
                          return (
                            <td key={day} className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={cell?.subject || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditedSchedule((prev) =>
                                    prev.map((s) => {
                                      if (s.day === day && s.session === "Chiều" && s.period === p) {
                                        return {
                                          ...s,
                                          assignments: {
                                            ...s.assignments,
                                            [targetClass]: {
                                              subject: val,
                                              teacher: cell?.teacher || profile.teacherName,
                                              isSpecialist: cell?.isSpecialist || false,
                                            },
                                          },
                                        };
                                      }
                                      return s;
                                    })
                                  );
                                }}
                                className="w-full px-1.5 py-1 text-center font-semibold text-[11px] border border-slate-200 rounded focus:border-blue-500 outline-none"
                              />
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

          {/* SYNCHRONIZATION OPTIONS */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Tùy chọn tự động đồng bộ sau khi áp dụng TKB mới:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-blue-100 text-slate-800 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncLBG}
                  onChange={(e) => setSyncLBG(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Đồng bộ Lịch Báo Giảng (Cột ghi chú để trống)</span>
              </label>

              <label className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-blue-100 text-slate-800 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncKHBD}
                  onChange={(e) => setSyncKHBD(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Đồng bộ Kế Hoạch Bài Dạy (KHBD 2345)</span>
              </label>

              <label className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-blue-100 text-slate-800 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncTeachers}
                  onChange={(e) => setSyncTeachers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Đồng bộ Phân công GV Chủ nhiệm & GV Chuyên</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleApply}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Áp Dụng TKB Mới & Đồng Bộ Toàn Bộ (TKB, LBG, KHBD, GV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
