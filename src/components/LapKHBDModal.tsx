import React, { useState } from "react";
import {
  SchoolProfile,
  TeachingScheduleEntry,
  LessonPlan,
  TeacherInfo,
} from "../types";
import {
  knownSpecialistsList,
  generateLessonPlansForGVCN,
  generateLessonPlansForSpecialistTeacher,
  isGVCNSubject,
  isSpecialistSubject,
} from "../utils/syncHelper";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle,
  AlertCircle,
  Check,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  lbgEntries: TeachingScheduleEntry[];
  currentPlans: LessonPlan[];
  onApplyPlans: (newPlans: LessonPlan[], message: string) => void;
  initialRole?: "gvcn" | "specialist";
  initialSpecialistName?: string;
}

export const LapKHBDModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  lbgEntries,
  currentPlans,
  onApplyPlans,
  initialRole = "gvcn",
  initialSpecialistName = "Cô Nương",
}) => {
  const [selectedRole, setSelectedRole] = useState<"gvcn" | "specialist">(initialRole);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>(initialSpecialistName);
  const [replaceMode, setReplaceMode] = useState<"merge" | "replace_target">("replace_target");

  if (!isOpen) return null;

  // Calculate potential entries for preview
  const previewGVCNEntries = lbgEntries.filter((e) => isGVCNSubject(e.subject, e.specialistTeacherName));
  const matchedSpecialistMeta = knownSpecialistsList.find((s) => s.name === selectedSpecialist);

  const previewSpecialistEntries = lbgEntries.filter((e) => {
    if (!isSpecialistSubject(e.subject, e.specialistTeacherName)) return false;
    if (e.specialistTeacherName && e.specialistTeacherName.includes(selectedSpecialist)) return true;
    if (matchedSpecialistMeta && (e.subject.includes(matchedSpecialistMeta.subject) || e.subject.includes(selectedSpecialist))) return true;
    return false;
  });

  const handleExecute = () => {
    if (selectedRole === "gvcn") {
      // Generate ONLY GVCN plans (Toán, Tiếng Việt, HĐTN) - excludes AN, TH, GDTC, MT, etc.
      const newGVCNPlans = generateLessonPlansForGVCN(profile, lbgEntries);
      if (newGVCNPlans.length === 0) {
        alert("Không tìm thấy tiết dạy nào của GVCN trong Lịch Báo Giảng tuần này.");
        return;
      }

      let updatedList: LessonPlan[];
      if (replaceMode === "replace_target") {
        // Keep specialist plans, replace GVCN plans
        const retainedSpecialistPlans = currentPlans.filter((p) => isSpecialistSubject(p.subject, p.specialistTeacherName || p.teacherName));
        updatedList = [...newGVCNPlans, ...retainedSpecialistPlans];
      } else {
        // Merge without duplicate IDs
        const existingIds = new Set(newGVCNPlans.map((p) => p.id));
        updatedList = [...newGVCNPlans, ...currentPlans.filter((p) => !existingIds.has(p.id))];
      }

      onApplyPlans(
        updatedList,
        `✓ ĐÃ LẬP THÀNH CÔNG SỔ KHBD GIÁO VIÊN CHỦ NHIỆM (${profile.teacherName})!\nĐã lập riêng ${newGVCNPlans.length} bài dạy (Toán, Tiếng Việt, HĐTN...). Tách biệt hoàn toàn, không lập chung với môn chuyên.`
      );
      onClose();
    } else {
      // Generate ONLY specialist plans for this teacher
      const newSpecPlans = generateLessonPlansForSpecialistTeacher(
        profile,
        lbgEntries,
        selectedSpecialist,
        matchedSpecialistMeta?.subject
      );

      if (newSpecPlans.length === 0) {
        alert(`Không tìm thấy tiết dạy nào của ${selectedSpecialist} (${matchedSpecialistMeta?.subject || ""}) trong Lịch Báo Giảng tuần này của lớp.`);
        return;
      }

      let updatedList: LessonPlan[];
      if (replaceMode === "replace_target") {
        // Replace ONLY this specialist teacher's plans
        const otherPlans = currentPlans.filter(
          (p) =>
            p.specialistTeacherName !== selectedSpecialist &&
            p.teacherName !== selectedSpecialist
        );
        updatedList = [...otherPlans, ...newSpecPlans];
      } else {
        const existingIds = new Set(newSpecPlans.map((p) => p.id));
        updatedList = [...newSpecPlans, ...currentPlans.filter((p) => !existingIds.has(p.id))];
      }

      onApplyPlans(
        updatedList,
        `✓ ĐÃ LẬP THÀNH CÔNG SỔ KHBD CHO GIÁO VIÊN CHUYÊN MÔN: ${selectedSpecialist}!\nMôn: ${matchedSpecialistMeta?.subject || "Chuyên môn"} • Đã lập riêng ${newSpecPlans.length} bài dạy chuẩn CV 2345.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Lập Kế Hoạch Bài Dạy Riêng Biệt Theo Giáo Viên
              </h3>
              <p className="text-xs text-blue-100">
                Tách riêng tiết dạy của GVCN và từng GV Chuyên môn • Không lập chung • Chuẩn CV 2345/BGDĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Instructions Box */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Quy định chuyên môn tiểu học:</strong> Kế hoạch bài dạy của <strong>Giáo viên chủ nhiệm</strong> và của <strong>Giáo viên chuyên môn</strong> phải được lập thành các cuốn sổ giáo án riêng biệt, lưu trữ độc lập theo từng giáo viên phụ trách, không được lập gộp chung một sổ.
            </div>
          </div>

          {/* Step 1: Pick Teacher Target */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              1. Chọn Đối Tượng Giáo Viên Cần Lập KHBD:
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option A: GVCN */}
              <button
                type="button"
                onClick={() => setSelectedRole("gvcn")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "gvcn"
                    ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {selectedRole === "gvcn" && (
                  <span className="absolute top-3 right-3 text-blue-600">
                    <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                  </span>
                )}
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <span className="text-lg">👩‍🏫</span>
                  <span>Giáo Viên Chủ Nhiệm (GVCN)</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <div>• Giáo viên: <strong>{profile.teacherName}</strong></div>
                  <div>• Lớp: <strong>{profile.className}</strong> (Khối {profile.grade})</div>
                  <div>• Môn lập: <strong>Toán, Tiếng Việt, HĐTN</strong></div>
                  <div className="text-blue-700 font-semibold pt-1">
                    → Tìm thấy {previewGVCNEntries.length} tiết GVCN trong tuần
                  </div>
                </div>
              </button>

              {/* Option B: GV Chuyên */}
              <button
                type="button"
                onClick={() => setSelectedRole("specialist")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "specialist"
                    ? "bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 text-purple-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {selectedRole === "specialist" && (
                  <span className="absolute top-3 right-3 text-purple-600">
                    <CheckCircle2 className="w-5 h-5 fill-purple-600 text-white" />
                  </span>
                )}
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <span className="text-lg">🎨</span>
                  <span>Giáo Viên Chuyên Môn (Từng GV)</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <div>• Lập riêng sổ giáo án cho từng GV chuyên</div>
                  <div>• Môn: <strong>Tiếng Anh, Âm nhạc, Mĩ thuật, GDTC, Tin học...</strong></div>
                  <div>• Ký tên và lưu trữ độc lập theo giáo viên</div>
                  <div className="text-purple-700 font-semibold pt-1">
                    → Chọn giáo viên cụ thể bên dưới
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* If Specialist is chosen: Show Teacher Selection */}
          {selectedRole === "specialist" && (
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-3">
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <span>Chọn Giáo Viên Chuyên Môn Cần Lập Sổ KHBD:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {knownSpecialistsList.map((spec) => {
                  const isChosen = selectedSpecialist === spec.name;
                  const countPeriods = lbgEntries.filter((e) => {
                    if (!e.isSpecialistPeriod) return false;
                    return (
                      (e.specialistTeacherName && e.specialistTeacherName.includes(spec.name)) ||
                      e.subject.includes(spec.subject) ||
                      e.subject.includes(spec.name)
                    );
                  }).length;

                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSelectedSpecialist(spec.name)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        isChosen
                          ? "bg-purple-600 text-white border-purple-700 font-bold shadow-xs"
                          : "bg-white border-purple-200 text-slate-700 hover:bg-purple-100/50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{spec.icon}</span>
                        <span className="truncate">{spec.name}</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 truncate ${isChosen ? "text-purple-100" : "text-slate-500"}`}>
                        {spec.subject}
                      </div>
                      <div className={`text-[10px] mt-0.5 font-semibold ${isChosen ? "text-amber-200" : "text-purple-700"}`}>
                        {countPeriods} tiết trong TKB tuần
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scope & Details Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Nội dung sẽ được lập tự động:
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>
                <strong>Tuần áp dụng:</strong> Tuần {profile.currentWeek} (Từ {profile.weekStartDate} đến {profile.weekEndDate})
              </li>
              <li>
                <strong>Giáo viên đứng tên:</strong>{" "}
                <span className="text-blue-700 font-bold">
                  {selectedRole === "gvcn" ? profile.teacherName : selectedSpecialist}
                </span>{" "}
                ({selectedRole === "gvcn" ? "Giáo viên chủ nhiệm" : `Giáo viên chuyên môn ${matchedSpecialistMeta?.subject || ""}`})
              </li>
              <li>
                <strong>Chuẩn cấu trúc Công văn 2345/BGDĐT:</strong> Đầy đủ Yêu cầu cần đạt (Năng lực đặc thù, Năng lực chung, Phẩm chất), Đồ dùng dạy học GV & HS, Tiến trình 4 hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng), tích hợp Năng lực số (CV 3456) và Trí tuệ nhân tạo (AI).
              </li>
              <li>
                <strong>Tính độc lập:</strong> Chỉ cập nhật vào Sổ KHBD của giáo viên này, không ảnh hưởng đến sổ bài dạy của các giáo viên khác.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-2 ${
              selectedRole === "gvcn"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {selectedRole === "gvcn"
                ? `Lập Sổ KHBD Riêng Cho GVCN (${profile.teacherName})`
                : `Lập Sổ KHBD Riêng Cho ${selectedSpecialist}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
