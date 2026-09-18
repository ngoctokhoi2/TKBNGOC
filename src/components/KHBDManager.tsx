import React, { useState } from "react";
import { SchoolProfile, LessonPlan, LessonActivity, DayOfWeek, TeachingScheduleEntry } from "../types";
import { exportWeekPackageDocx } from "../utils/docxExport";
import { knownSpecialistsList, isGVCNSubject, isSpecialistSubject } from "../utils/syncHelper";
import { LapKHBDModal } from "./LapKHBDModal";
import {
  BookOpen,
  Download,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Tag,
  ChevronDown,
  ChevronUp,
  FileDown,
  Lightbulb,
  UserCheck,
  Check,
  FolderDown,
  CheckSquare,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  lessonPlans: LessonPlan[];
  lbgEntries?: TeachingScheduleEntry[];
  onUpdateLessonPlans: (plans: LessonPlan[]) => void;
  onOpenAIGenerator: (
    subject?: string,
    lessonTitle?: string,
    day?: DayOfWeek,
    teacherRole?: "gvcn" | "specialist",
    teacherName?: string
  ) => void;
  onOpenChangeTKBModal?: () => void;
  onNavigateToWorksheetTab?: (subject?: string) => void;
}

export const KHBDManager: React.FC<Props> = ({
  profile,
  lessonPlans,
  lbgEntries = [],
  onUpdateLessonPlans,
  onOpenAIGenerator,
  onOpenChangeTKBModal,
  onNavigateToWorksheetTab,
}) => {
  const [roleFilter, setRoleFilter] = useState<"gvcn" | "specialist" | "all">("gvcn");
  const [specialistTeacherFilter, setSpecialistTeacherFilter] = useState<string>("Cô Nương");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("all");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(
    lessonPlans.length > 0 ? lessonPlans[0].id : null
  );
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  // Modal State for Lập KHBD Riêng Biệt Theo Giáo Viên
  const [isLapModalOpen, setIsLapModalOpen] = useState(false);
  const [lapModalInitialRole, setLapModalInitialRole] = useState<"gvcn" | "specialist">("gvcn");
  const [lapModalInitialSpecialist, setLapModalInitialSpecialist] = useState<string>("Cô Nương");
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const daysOrder: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  // Separate GVCN and Specialist plans strictly
  // Specialist subjects (AN, TH, GDTC, MT, TA, TNXH, Đạo đức) are strictly excluded from GVCN
  const gvcnPlans = lessonPlans.filter((p) => isGVCNSubject(p.subject, p.specialistTeacherName || p.teacherName));
  const specialistPlans = lessonPlans.filter((p) => isSpecialistSubject(p.subject, p.specialistTeacherName || p.teacherName));

  // Available specialist teachers from plans + standard list
  const existingSpecialistNames = Array.from(
    new Set(
      specialistPlans
        .map((p) => p.specialistTeacherName || p.teacherName || "")
        .filter(Boolean)
    )
  );

  // Determine base plans by selected role
  let basePlansByRole: LessonPlan[] = lessonPlans;
  if (roleFilter === "gvcn") {
    basePlansByRole = gvcnPlans;
  } else if (roleFilter === "specialist") {
    if (specialistTeacherFilter === "all") {
      basePlansByRole = specialistPlans;
    } else {
      basePlansByRole = specialistPlans.filter(
        (p) =>
          p.specialistTeacherName === specialistTeacherFilter ||
          p.teacherName === specialistTeacherFilter ||
          p.subject.includes(specialistTeacherFilter)
      );
    }
  }

  // Filter by Day
  const filteredPlans =
    selectedDayFilter === "all"
      ? basePlansByRole
      : basePlansByRole.filter((p) => p.dayOfWeek === selectedDayFilter);

  const handleToggleExpand = (id: string) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Kế hoạch bài dạy này?")) {
      onUpdateLessonPlans(lessonPlans.filter((p) => p.id !== id));
    }
  };

  const handleSaveEditedPlan = () => {
    if (!editingPlan) return;
    const updated = lessonPlans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    onUpdateLessonPlans(updated);
    setEditingPlan(null);
  };

  const handleExportSinglePlan = (plan: LessonPlan) => {
    exportWeekPackageDocx(profile, [], [plan], {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: false,
      targetRole: plan.isSpecialist ? "specialist" : "gvcn",
      customTeacherName: plan.teacherName,
      customSubjectName: plan.subject,
    });
  };

  // Export current viewed plans
  const handleExportCurrentView = () => {
    exportWeekPackageDocx(profile, [], filteredPlans, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: false,
      targetRole: roleFilter === "specialist" ? "specialist" : "gvcn",
    });
  };

  // Export GVCN only (with or without LBG)
  const handleExportGVCNPackage = (includeLBG: boolean = true) => {
    const lbgForGVCN = includeLBG
      ? lbgEntries.filter((e) => isGVCNSubject(e.subject, e.specialistTeacherName))
      : [];
    exportWeekPackageDocx(profile, lbgForGVCN, gvcnPlans, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: includeLBG,
      targetRole: "gvcn",
      customTeacherName: profile.teacherName,
      customFileName: includeLBG
        ? `KHBD_Kem_LBG_GVCN_Tuan_${profile.currentWeek}_Lop_${profile.className}_${profile.teacherName.replace(/\s+/g, "_")}.docx`
        : `KHBD_GVCN_Tuan_${profile.currentWeek}_Lop_${profile.className}_${profile.teacherName.replace(/\s+/g, "_")}.docx`,
    });
  };

  // Export Specialist for specific teacher
  const handleExportTeacherSpecificPackage = (teacherName: string, subjectName?: string) => {
    const plansForTeacher = specialistPlans.filter(
      (p) =>
        p.specialistTeacherName === teacherName ||
        p.teacherName === teacherName ||
        (subjectName && p.subject.includes(subjectName))
    );

    if (plansForTeacher.length === 0) {
      alert(`Không có bài dạy nào của ${teacherName} trong tuần này.`);
      return;
    }

    const matchedMeta = knownSpecialistsList.find((s) => s.name === teacherName);
    const resolvedSubject = subjectName || matchedMeta?.subject || plansForTeacher[0]?.subject || "ChuyenMon";

    exportWeekPackageDocx(profile, [], plansForTeacher, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: false,
      targetRole: "specialist",
      customTeacherName: teacherName,
      customSubjectName: resolvedSubject,
      customDocumentTitle: `KẾ HOẠCH BÀI DẠY TUẦN ${profile.currentWeek} - GIÁO VIÊN BỘ MÔN ${resolvedSubject.toUpperCase()}`,
      customFileName: `KHBD_${resolvedSubject.replace(/\s+/g, "_")}_${teacherName.replace(/\s+/g, "_")}_Tuan_${profile.currentWeek}_Lop_${profile.className}.docx`,
    });
  };

  // Export Specialist package (either selected teacher or all specialist)
  const handleExportSpecialistPackage = () => {
    if (specialistTeacherFilter !== "all") {
      const matchedMeta = knownSpecialistsList.find((s) => s.name === specialistTeacherFilter);
      handleExportTeacherSpecificPackage(specialistTeacherFilter, matchedMeta?.subject);
      return;
    }

    exportWeekPackageDocx(profile, [], specialistPlans, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: false,
      targetRole: "specialist",
      customTeacherName: "Giáo viên bộ môn chuyên",
      customFileName: `KHBD_Mon_Chuyen_Tuan_${profile.currentWeek}_Lop_${profile.className}.docx`,
    });
  };

  // Batch Export all specialist teachers sequentially
  const handleBatchExportSpecialists = () => {
    const uniqueTeachers = Array.from(
      new Set(specialistPlans.map((p) => p.specialistTeacherName || p.teacherName).filter(Boolean))
    );

    if (uniqueTeachers.length === 0) {
      alert("Không có giáo viên chuyên môn nào trong tuần này.");
      return;
    }

    uniqueTeachers.forEach((tName, idx) => {
      setTimeout(() => {
        handleExportTeacherSpecificPackage(tName as string);
      }, idx * 600);
    });
  };

  const handleOpenLapModal = (role: "gvcn" | "specialist", teacherName?: string) => {
    setLapModalInitialRole(role);
    if (teacherName) setLapModalInitialSpecialist(teacherName);
    setIsLapModalOpen(true);
  };

  const handleApplyPlansFromModal = (newPlans: LessonPlan[], message: string) => {
    onUpdateLessonPlans(newPlans);
    setToastNotification(message);
    setTimeout(() => setToastNotification(null), 6000);
  };

  const handleExportFullPackage = () => {
    if (roleFilter === "gvcn") {
      handleExportGVCNPackage(true);
    } else if (roleFilter === "specialist") {
      handleExportSpecialistPackage();
    } else {
      exportWeekPackageDocx(profile, lbgEntries, lessonPlans, {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        includeLBGPage1: true,
      });
    }
  };

  const selectedSpecMeta = knownSpecialistsList.find((s) => s.name === specialistTeacherFilter);
  const currentSpecSubject = selectedSpecMeta?.subject || "Tiếng Anh";

  return (
    <div className="space-y-4">
      {/* Toast Feedback Notification */}
      {toastNotification && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-start gap-3 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
          <div className="text-xs font-medium whitespace-pre-line leading-relaxed">
            {toastNotification}
          </div>
        </div>
      )}

      {/* Top Header & Fast Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Kế Hoạch Bài Dạy (KHBD) Chuẩn Công Văn 2345/BGDĐT
            </h2>
            <p className="text-xs text-slate-500">
              Lớp <strong>{profile.className}</strong> (Khối {profile.grade}) • GVCN: <strong>{profile.teacherName}</strong> • Tuần <strong>{profile.currentWeek}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Action: Lập KHBD Riêng Biệt Theo Giáo Viên */}
          <button
            onClick={() => handleOpenLapModal(roleFilter === "specialist" ? "specialist" : "gvcn", specialistTeacherFilter !== "all" ? specialistTeacherFilter : "Cô Nương")}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Lập KHBD tách riêng các tiết dạy của GV chuyên và GV chủ nhiệm, lập riêng biệt không lập chung"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>⚡ LẬP KHBD THEO GIÁO VIÊN</span>
          </button>

          {onNavigateToWorksheetTab && (
            <button
              onClick={() => onNavigateToWorksheetTab()}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Tải & làm các phiếu bài tập trắc nghiệm cuối tuần (Nguồn loigiaihay.com)"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phiếu Cuối Tuần</span>
            </button>
          )}

          {onOpenChangeTKBModal && (
            <button
              onClick={onOpenChangeTKBModal}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Đổi TKB mới và tự động đồng bộ sang Lịch Báo Giảng & KHBD"
            >
              <span>🔄 Đổi TKB</span>
            </button>
          )}

          {roleFilter === "gvcn" ? (
            <>
              <button
                onClick={() => onOpenAIGenerator("Toán", undefined, undefined, "gvcn", profile.teacherName)}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Sử dụng AI soạn kế hoạch bài dạy cho GVCN"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Soạn AI (GVCN)</span>
              </button>

              <button
                onClick={() => handleExportGVCNPackage(false)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Tải riêng toàn bộ giáo án của GVCN"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Sổ GVCN (.docx)</span>
              </button>

              <button
                onClick={() => handleExportGVCNPackage(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Xuất file Word GVCN: Trang 1 là LBG của GVCN, tiếp theo là KHBD các môn GVCN dạy"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Tải Sổ GVCN (Trang 1 là LBG) (.docx)</span>
              </button>
            </>
          ) : roleFilter === "specialist" ? (
            <>
              <button
                onClick={() =>
                  onOpenAIGenerator(
                    currentSpecSubject,
                    undefined,
                    undefined,
                    "specialist",
                    specialistTeacherFilter !== "all" ? specialistTeacherFilter : "Cô Nương"
                  )
                }
                className="px-3 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Soạn AI ({specialistTeacherFilter !== "all" ? specialistTeacherFilter : "GV Chuyên"})</span>
              </button>

              <button
                onClick={handleExportSpecialistPackage}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Tải kế hoạch bài dạy của giáo viên chuyên môn này"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Tải Sổ {specialistTeacherFilter !== "all" ? specialistTeacherFilter : "GV Chuyên"} (.docx)</span>
              </button>

              <button
                onClick={handleBatchExportSpecialists}
                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Tải lần lượt từng file Sổ KHBD riêng biệt cho từng giáo viên chuyên"
              >
                <FolderDown className="w-3.5 h-3.5 text-purple-700" />
                <span>Tải Từng Sổ Từng GV</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleExportCurrentView}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Đang Xem (.docx)</span>
              </button>

              <button
                onClick={handleExportFullPackage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Tải Toàn Bộ Lớp (.docx)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Role Separation Selector (GVCN vs GV Chuyên) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Phân quyền & Sổ KHBD:
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => {
                  setRoleFilter("gvcn");
                  setSelectedDayFilter("all");
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  roleFilter === "gvcn"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👩‍🏫 Sổ KHBD GVCN ({profile.teacherName})</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    roleFilter === "gvcn" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {gvcnPlans.length} bài
                </span>
              </button>

              <button
                onClick={() => {
                  setRoleFilter("specialist");
                  setSelectedDayFilter("all");
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  roleFilter === "specialist"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🎨 Sổ KHBD GV Chuyên Môn (Từng Giáo Viên)</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    roleFilter === "specialist" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {specialistPlans.length} bài
                </span>
              </button>

              <button
                onClick={() => {
                  setRoleFilter("all");
                  setSelectedDayFilter("all");
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  roleFilter === "all"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Xem Chung Toàn Bộ</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    roleFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {lessonPlans.length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenLapModal(roleFilter === "specialist" ? "specialist" : "gvcn", specialistTeacherFilter !== "all" ? specialistTeacherFilter : "Cô Nương")}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {roleFilter === "gvcn"
                  ? `Lập Sổ Riêng GVCN`
                  : `Lập Sổ Riêng ${specialistTeacherFilter !== "all" ? specialistTeacherFilter : "GV Chuyên"}`}
              </span>
            </button>
          </div>
        </div>

        {/* If Specialist tab: Ribbon of Teacher Chips */}
        {roleFilter === "specialist" && (
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-950 flex items-center gap-1">
                <span>Chọn Giáo Viên Chuyên Môn Cần Xem / Lập Sổ KHBD:</span>
              </span>
              <span className="text-purple-700 text-[11px]">
                Đang chọn: <strong>{specialistTeacherFilter === "all" ? "Tất cả GV chuyên" : specialistTeacherFilter}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {knownSpecialistsList.map((spec) => {
                const isSelected = specialistTeacherFilter === spec.name;
                const count = specialistPlans.filter(
                  (p) =>
                    p.specialistTeacherName === spec.name ||
                    p.teacherName === spec.name ||
                    p.subject.includes(spec.subject) ||
                    p.subject.includes(spec.name)
                ).length;

                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setSpecialistTeacherFilter(spec.name);
                      setSelectedDayFilter("all");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-xs font-bold"
                        : "bg-white text-slate-700 border border-purple-200 hover:bg-purple-100/60"
                    }`}
                  >
                    <span>{spec.icon}</span>
                    <span>{spec.name}</span>
                    <span className={`text-[11px] ${isSelected ? "text-purple-200" : "text-slate-500"}`}>
                      ({spec.subject})
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/25 text-white" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {count} bài
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setSpecialistTeacherFilter("all");
                  setSelectedDayFilter("all");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  specialistTeacherFilter === "all"
                    ? "bg-purple-900 text-white shadow-xs font-bold"
                    : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-50"
                }`}
              >
                <span>Tất Cả ({specialistPlans.length} bài)</span>
              </button>
            </div>
          </div>
        )}

        {/* Informative Guidance Banner */}
        {roleFilter === "gvcn" && (
          <div className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
            <span className="text-base font-bold text-emerald-700">✓</span>
            <div>
              <strong>Sổ Kế Hoạch Bài Dạy Giáo Viên Chủ Nhiệm ({profile.teacherName})</strong>: Chỉ gồm các bài dạy môn <strong>Toán, Tiếng Việt, Hoạt động trải nghiệm</strong>. Các môn chuyên gồm <strong>Âm nhạc (AN), Tin học (TH), GDTC, Mĩ thuật (MT), Tiếng Anh, TNXH, Đạo đức</strong> đã được loại khỏi sổ GVCN và lập riêng ở mục "Sổ KHBD GV Chuyên Môn".
            </div>
          </div>
        )}

        {roleFilter === "specialist" && (
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
            <span className="text-base">🎨</span>
            <div>
              <strong>Sổ Kế Hoạch Bài Dạy Giáo Viên Chuyên Môn</strong>: Lập riêng biệt từng cuốn sổ cho từng giáo viên phụ trách bộ môn (Tiếng Anh - Cô Nương, Âm nhạc - Cô Tuệ, Mĩ thuật - Cô Thy, GDTC - Cô Nhàn, Tin học - Cô Phương, TNXH & Đạo đức - Cô Thủy). Xuất file Word có tiêu đề và tên giáo viên độc lập để ký duyệt riêng.
            </div>
          </div>
        )}
      </div>

      {/* Day Filter Tab Bar */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSelectedDayFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              selectedDayFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Tất cả ngày ({basePlansByRole.length} bài)
          </button>
          {daysOrder.map((day) => {
            const count = basePlansByRole.filter((p) => p.dayOfWeek === day).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedDayFilter === day
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedDayFilter === day ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-medium px-2">
          Đang hiển thị: <strong className="text-slate-800">{filteredPlans.length}</strong> bài dạy
        </div>
      </div>

      {/* Lesson Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Chưa có Kế hoạch bài dạy cho ngày này</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Bạn có thể dùng Trợ lý AI để tự động soạn giáo án chi tiết chuẩn CV 2345 có đầy đủ tích hợp Năng lực số, AI, QPAN, Quyền con người...
          </p>
          <button
            onClick={() => onOpenAIGenerator(undefined, undefined, selectedDayFilter !== "all" ? (selectedDayFilter as DayOfWeek) : undefined)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Soạn KHBD Bằng AI Ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Plan Card Header */}
                <div
                  onClick={() => handleToggleExpand(plan.id)}
                  className="p-4 bg-white hover:bg-slate-50/80 cursor-pointer flex flex-wrap items-center justify-between gap-3 border-b border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 py-1 rounded-md text-white font-semibold text-xs shadow-xs ${
                        plan.isSpecialist ? "bg-purple-600" : "bg-blue-600"
                      }`}
                    >
                      {plan.dayOfWeek}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          {plan.subject} ({plan.period}): {plan.lessonTitle}
                        </span>
                        {plan.isSpecialist ? (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                            GV Chuyên: {plan.specialistTeacherName || plan.teacherName || "Môn chuyên"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                            GVCN: {plan.teacherName || profile.teacherName}
                          </span>
                        )}
                        {plan.topic && (
                          <span className="text-xs text-slate-500 font-medium">| {plan.topic}</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Lớp: {plan.grade} ({profile.className})</span>
                        <span>•</span>
                        <span>
                          Giảng dạy: <strong>{plan.teacherName || profile.teacherName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2">
                    {plan.integratedTags && plan.integratedTags.length > 0 && (
                      <div className="hidden md:flex items-center gap-1">
                        {plan.integratedTags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSinglePlan(plan);
                      }}
                      className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-md border border-slate-200 text-xs shadow-xs cursor-pointer"
                      title="Xuất riêng bài dạy này ra Word"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan.id);
                      }}
                      className="p-1.5 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-slate-200 text-xs shadow-xs cursor-pointer"
                      title="Xóa bài dạy này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Lesson Plan View (CV 2345 standard) */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-white text-xs leading-relaxed text-slate-800">
                    {/* Header Banner inside document */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">
                          {profile.schoolName} — Lớp {profile.className}
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          KẾ HOẠCH BÀI DẠY: {plan.subject.toUpperCase()}
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                          Tên bài dạy: {plan.lessonTitle} ({plan.period})
                        </div>
                      </div>

                      {plan.integratedContent && (
                        <div className="bg-blue-50/60 border border-blue-200 p-2.5 rounded-md max-w-md text-xs text-blue-900">
                          <div className="font-semibold flex items-center gap-1 text-blue-800">
                            <Tag className="w-3.5 h-3.5" />
                            Nội dung tích hợp lồng ghép:
                          </div>
                          <div className="italic mt-0.5">{plan.integratedContent}</div>
                        </div>
                      )}
                    </div>

                    {/* I. YÊU CẦU CẦN ĐẠT */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        I. Yêu Cầu Cần Đạt
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        {/* 1. Năng lực đặc thù */}
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                          <span className="font-semibold text-slate-900 text-xs block">1. Năng lực đặc thù:</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {(plan.objectives?.specificCompetencies || []).map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 2. Năng lực chung */}
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                          <span className="font-semibold text-slate-900 text-xs block">2. Năng lực chung:</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {(plan.objectives?.generalCompetencies || []).map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 3. Phẩm chất */}
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                          <span className="font-semibold text-slate-900 text-xs block">3. Phẩm chất:</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {(plan.objectives?.qualities || []).map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* II. ĐỒ DÙNG DẠY HỌC */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
                        II. Đồ Dùng Dạy Học Và Học Liệu
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="text-slate-800">1. Giáo viên:</strong>{" "}
                          <span className="text-slate-600">{plan.equipment?.teacher || "KHBD, SGK, máy chiếu, tranh ảnh minh họa."}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="text-slate-800">2. Học sinh:</strong>{" "}
                          <span className="text-slate-600">{plan.equipment?.students || "SGK, vở ghi, bảng con, đồ dùng học tập."}</span>
                        </div>
                      </div>
                    </div>

                    {/* III. CÁC HOẠT ĐỘNG DẠY HỌC (BẢNG 2 CỘT CHUẨN CÔNG VĂN 2345) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
                        III. Các Hoạt Động Dạy Học Chủ Yếu
                      </h4>

                      <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300 text-center">
                              <th className="p-2.5 w-1/2 border-r border-slate-300">HOẠT ĐỘNG CỦA GIÁO VIÊN</th>
                              <th className="p-2.5 w-1/2">HOẠT ĐỘNG CỦA HỌC SINH</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(plan.activities || []).map((act, aIdx) => (
                              <React.Fragment key={aIdx}>
                                {/* Step Title Row */}
                                <tr className="bg-slate-100 border-y border-slate-300">
                                  <td colSpan={2} className="px-3.5 py-2">
                                    <div className="flex items-center justify-between font-bold text-slate-900">
                                      <span>★ {act.title}</span>
                                      {act.time && <span className="text-[11px] text-slate-500 font-normal italic">({act.time})</span>}
                                    </div>
                                    {act.objective && (
                                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                                        Mục tiêu: {act.objective}
                                      </div>
                                    )}
                                  </td>
                                </tr>

                                {/* 2 Column Activities */}
                                <tr className="border-b border-slate-200 align-top hover:bg-slate-50/50">
                                  <td className="p-3.5 border-r border-slate-300 whitespace-pre-line text-slate-700 leading-relaxed">
                                    {act.teacherActivity}
                                  </td>
                                  <td className="p-3.5 whitespace-pre-line text-slate-700 leading-relaxed">
                                    {act.studentActivity}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* IV. ĐIỀU CHỈNH SAU BÀI DẠY */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        IV. Điều Chỉnh Sau Bài Dạy (Nếu Có)
                      </h4>
                      <p className="text-slate-500 italic">
                        {plan.adjustment || "................................................................................................................................................................"}
                      </p>
                    </div>

                    {/* Bottom Action inside Expanded Plan */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                      <button
                        onClick={() => handleExportSinglePlan(plan)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Xuất Bài Dạy Này (.docx)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lập KHBD Riêng Biệt Cho GVCN hoặc GV Chuyên */}
      <LapKHBDModal
        isOpen={isLapModalOpen}
        onClose={() => setIsLapModalOpen(false)}
        profile={profile}
        lbgEntries={lbgEntries}
        allPlans={lessonPlans}
        onApplyPlans={handleApplyPlansFromModal}
        initialRole={lapModalInitialRole}
        initialSpecialistTeacher={lapModalInitialSpecialist}
      />
    </div>
  );
};
