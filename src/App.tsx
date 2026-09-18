import React, { useState, useEffect } from "react";
import {
  SchoolProfile,
  TimetableSlot,
  TimetableCell,
  TeachingScheduleEntry,
  LessonPlan,
  GradeLevel,
  DayOfWeek,
  TeacherInfo,
} from "./types";
import {
  initialSchoolProfile,
  initialTeachers,
  initialClassList,
  initialSchoolTimetable,
  generateInitialLBG,
} from "./data/defaultData";
import { sampleLessonPlans } from "./data/curriculumData";
import { Navbar } from "./components/Navbar";
import { HeaderInfoBar } from "./components/HeaderInfoBar";
import { TimetableEditor } from "./components/TimetableEditor";
import { LichBaoGiangView } from "./components/LichBaoGiangView";
import { KHBDManager } from "./components/KHBDManager";
import { AIKHBDGenerator } from "./components/AIKHBDGenerator";
import { PhieuBaiTapView } from "./components/PhieuBaiTapView";
import { SchoolSettingsModal } from "./components/SchoolSettingsModal";
import { ChangeTimetableModal } from "./components/ChangeTimetableModal";
import { exportWeekPackageDocx } from "./utils/docxExport";
import {
  generateLBGFromTimetable,
  generateSynchronizedLessonPlans,
  generateLessonPlansForGVCN,
  generateLessonPlansForSpecialistTeacher,
  calculateWeekDates,
} from "./utils/syncHelper";

export default function App() {
  const [activeTab, setActiveTab] = useState<"timetable" | "lbg" | "khbd" | "ai_khbd" | "phieu_cuoi_tuan">("lbg");
  const [profile, setProfile] = useState<SchoolProfile>(initialSchoolProfile);
  const [teachers, setTeachers] = useState<TeacherInfo[]>(initialTeachers);
  const [classList, setClassList] = useState<string[]>(initialClassList);
  const [schedule, setSchedule] = useState<TimetableSlot[]>(initialSchoolTimetable);
  const [selectedClassId, setSelectedClassId] = useState<string>("2.2");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("t-ngoc");
  const [worksheetSubject, setWorksheetSubject] = useState<string | undefined>(undefined);
  const [lbgEntries, setLbgEntries] = useState<TeachingScheduleEntry[]>(() =>
    generateInitialLBG(initialSchoolProfile)
  );
  // Strictly initialize GVCN's KHBD with only GVCN subjects (Toán, Tiếng Việt, HĐTN)
  // Specialist subjects (AN, TH, GDTC, MT, TA, TNXH, Đạo đức) are excluded
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() =>
    generateLessonPlansForGVCN(initialSchoolProfile, generateInitialLBG(initialSchoolProfile))
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangeTKBModalOpen, setIsChangeTKBModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // AI Modal generator state if triggered with specific lesson
  const [aiGenContext, setAiGenContext] = useState<{
    subject?: string;
    lessonTitle?: string;
    day?: DayOfWeek;
    teacherRole?: "gvcn" | "specialist";
    teacherName?: string;
  }>({});

  // Sync TKB to LBG and KHBD handler
  const handleSyncTKBToLBG = (
    sched = schedule,
    tchs = teachers,
    tId = selectedTeacherId,
    cId = selectedClassId,
    prof = profile
  ) => {
    const newLBG = generateLBGFromTimetable(prof, sched, tchs, tId, cId);
    setLbgEntries(newLBG);

    const currentTeacher = tchs.find((t) => t.id === tId) || tchs[0];
    let newPlans: LessonPlan[];
    if (currentTeacher?.isSpecialist) {
      newPlans = generateLessonPlansForSpecialistTeacher(
        prof,
        newLBG,
        currentTeacher.name,
        currentTeacher.subjectSpecialty
      );
    } else {
      // GVCN: strictly exclude all specialist subjects (AN, TH, GDTC, MT, etc.)
      newPlans = generateLessonPlansForGVCN(prof, newLBG);
    }

    if (newPlans.length > 0) {
      setLessonPlans(newPlans);
    }

    return { newLBG, currentTeacher };
  };

  // When TKB changes via the dedicated ChangeTimetableModal
  const handleApplyNewTimetable = (
    newSchedule: TimetableSlot[],
    updatedTeachers: TeacherInfo[],
    targetClassId: string
  ) => {
    setSchedule(newSchedule);
    setTeachers(updatedTeachers);
    setSelectedClassId(targetClassId);

    const gradeNum = (parseInt(targetClassId.charAt(0), 10) || 2) as GradeLevel;
    const assignedTeacher =
      updatedTeachers.find((t) => t.assignedClass === targetClassId) ||
      updatedTeachers.find((t) => t.id === selectedTeacherId) ||
      updatedTeachers[0];

    const updatedProfile: SchoolProfile = {
      ...profile,
      className: targetClassId,
      grade: gradeNum,
      teacherName: assignedTeacher.name,
      departmentGroup: `TỔ CHUYÊN MÔN KHỐI ${gradeNum}`,
    };

    setProfile(updatedProfile);
    setSelectedTeacherId(assignedTeacher.id);

    // Synchronize both LBG and KHBD directly
    const { newLBG } = handleSyncTKBToLBG(
      newSchedule,
      updatedTeachers,
      assignedTeacher.id,
      targetClassId,
      updatedProfile
    );

    setIsChangeTKBModalOpen(false);
    setActiveTab("lbg");

    setToastMessage(
      `✓ ĐÃ ĐỒNG BỘ THÀNH CÔNG TKB MỚI!\nLớp: ${targetClassId} (Khối ${gradeNum}) • Giáo viên: ${assignedTeacher.name}\nLịch Báo Giảng: ${newLBG.length} tiết (chuẩn 7 tiết/ngày, cột Ghi chú để trống) • KHBD tự động khớp tuần 1 bắt đầu 07/09/2026!`
    );
  };

  // Handler when teacher is switched from the header dropdown
  const handleSelectTeacher = (tId: string) => {
    setSelectedTeacherId(tId);
    const found = teachers.find((t) => t.id === tId);
    if (found) {
      const updatedClass = found.assignedClass || selectedClassId;
      const gradeNum = (parseInt(updatedClass.charAt(0), 10) || profile.grade) as GradeLevel;
      const updatedProf: SchoolProfile = {
        ...profile,
        teacherName: found.name,
        className: updatedClass,
        grade: gradeNum,
      };
      setProfile(updatedProf);
      if (found.assignedClass) {
        setSelectedClassId(found.assignedClass);
      }
      handleSyncTKBToLBG(schedule, teachers, tId, updatedClass, updatedProf);
    }
  };

  // Handler when class is switched from header
  const handleSelectClass = (cId: string) => {
    setSelectedClassId(cId);
    const gradeNum = (parseInt(cId.charAt(0), 10) || 2) as GradeLevel;
    const matchedTeacher = teachers.find((t) => t.assignedClass === cId);
    const updatedProf: SchoolProfile = {
      ...profile,
      className: cId,
      grade: gradeNum,
      departmentGroup: `TỔ CHUYÊN MÔN KHỐI ${gradeNum}`,
      ...(matchedTeacher ? { teacherName: matchedTeacher.name } : {}),
    };
    setProfile(updatedProf);
    if (matchedTeacher) {
      setSelectedTeacherId(matchedTeacher.id);
    }
    handleSyncTKBToLBG(
      schedule,
      teachers,
      matchedTeacher ? matchedTeacher.id : selectedTeacherId,
      cId,
      updatedProf
    );
  };

  const handleUpdateProfile = (updated: Partial<SchoolProfile>) => {
    const newProf = { ...profile, ...updated };
    if (updated.currentWeek && updated.currentWeek !== profile.currentWeek) {
      const { weekStartDate, weekEndDate } = calculateWeekDates(updated.currentWeek, "07/09/2026");
      newProf.weekStartDate = weekStartDate;
      newProf.weekEndDate = weekEndDate;
      handleSyncTKBToLBG(schedule, teachers, selectedTeacherId, selectedClassId, newProf);
    }
    setProfile(newProf);
  };

  const handleSaveAIPlan = (newPlan: LessonPlan) => {
    setLessonPlans((prev) => [newPlan, ...prev]);
    setActiveTab("khbd");
  };

  const handleOpenAIGeneratorWithContext = (
    subject?: string,
    lessonTitle?: string,
    day?: DayOfWeek,
    teacherRole?: "gvcn" | "specialist",
    teacherName?: string
  ) => {
    setAiGenContext({ subject, lessonTitle, day, teacherRole, teacherName });
    setActiveTab("ai_khbd");
  };

  const handleQuickExportWeek = () => {
    exportWeekPackageDocx(profile, lbgEntries, lessonPlans, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onQuickExportWeek={handleQuickExportWeek}
      />

      {/* Grade, Class, Teacher, Week & Font Control Strip */}
      <HeaderInfoBar
        profile={profile}
        teachers={teachers}
        classList={classList}
        onUpdateProfile={handleUpdateProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        selectedTeacherId={selectedTeacherId}
        onSelectTeacher={handleSelectTeacher}
        selectedClassId={selectedClassId}
        onSelectClass={handleSelectClass}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === "timetable" && (
          <TimetableEditor
            profile={profile}
            schedule={schedule}
            teachers={teachers}
            classList={classList}
            selectedClassId={selectedClassId}
            selectedTeacherId={selectedTeacherId}
            onUpdateSchedule={(newSched) => {
              setSchedule(newSched);
              handleSyncTKBToLBG(newSched, teachers, selectedTeacherId, selectedClassId, profile);
            }}
            onSyncToLBG={() => {
              handleSyncTKBToLBG(schedule, teachers, selectedTeacherId, selectedClassId, profile);
              setActiveTab("lbg");
            }}
            onOpenChangeTKBModal={() => setIsChangeTKBModalOpen(true)}
          />
        )}

        {activeTab === "lbg" && (
          <LichBaoGiangView
            profile={profile}
            entries={lbgEntries}
            lessonPlans={lessonPlans}
            onUpdateEntries={(newEntries) => {
              setLbgEntries(newEntries);
              const currentTeacher = teachers.find((t) => t.id === selectedTeacherId);
              const newPlans = currentTeacher?.isSpecialist
                ? generateLessonPlansForSpecialistTeacher(
                    profile,
                    newEntries,
                    currentTeacher.name,
                    currentTeacher.subjectSpecialty
                  )
                : generateLessonPlansForGVCN(profile, newEntries);
              if (newPlans.length > 0) {
                setLessonPlans(newPlans);
              }
            }}
            onNavigateToKHBD={(title) => {
              setActiveTab("khbd");
            }}
            onOpenChangeTKBModal={() => setIsChangeTKBModalOpen(true)}
            onNavigateToWorksheetTab={(subj) => {
              if (subj) setWorksheetSubject(subj);
              setActiveTab("phieu_cuoi_tuan");
            }}
          />
        )}

        {activeTab === "khbd" && (
          <KHBDManager
            profile={profile}
            lessonPlans={lessonPlans}
            lbgEntries={lbgEntries}
            onUpdateLessonPlans={setLessonPlans}
            onOpenAIGenerator={handleOpenAIGeneratorWithContext}
            onOpenChangeTKBModal={() => setIsChangeTKBModalOpen(true)}
            onNavigateToWorksheetTab={(subj) => {
              if (subj) setWorksheetSubject(subj);
              setActiveTab("phieu_cuoi_tuan");
            }}
          />
        )}

        {activeTab === "phieu_cuoi_tuan" && (
          <PhieuBaiTapView
            profile={profile}
            initialSubject={worksheetSubject}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === "ai_khbd" && (
          <AIKHBDGenerator
            profile={profile}
            initialSubject={aiGenContext.subject || "Toán"}
            initialLessonTitle={aiGenContext.lessonTitle || `Bài học Tuần ${profile.currentWeek}`}
            initialDay={aiGenContext.day || "Thứ Hai"}
            initialTeacherRole={aiGenContext.teacherRole || "gvcn"}
            initialTeacherName={aiGenContext.teacherName}
            onSaveToWeeklyPlan={handleSaveAIPlan}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            Hệ thống Quản lý TKB, Lịch Báo Giảng & Kế hoạch bài dạy Chuẩn GDPT 2018 (CV 2345/BGDĐT)
          </span>
          <span className="font-semibold text-slate-700">
            Trường Tiểu học Mỹ Lạc - Xã Mỹ Lạc • GV: Nguyễn Thị KIM NGỌC (Lớp 2) • Hỗ trợ xuất Word Font 12, 13, 14 pt
          </span>
        </div>
      </footer>

      {/* Modal 1: School & Profile Settings */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          setSelectedClassId(updated.className);
          const matched = teachers.find((t) => t.name === updated.teacherName);
          if (matched) setSelectedTeacherId(matched.id);
        }}
      />

      {/* Modal 2: Change Timetable Modal (Thay đổi TKB mới & Tự động đồng bộ LBG, KHBD, Phân công GV) */}
      <ChangeTimetableModal
        isOpen={isChangeTKBModalOpen}
        onClose={() => setIsChangeTKBModalOpen(false)}
        profile={profile}
        currentSchedule={schedule}
        teachers={teachers}
        classList={classList}
        selectedClassId={selectedClassId}
        onApplyNewTimetable={handleApplyNewTimetable}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          id="sync-notification-toast"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-700 text-white px-5 py-4 rounded-xl shadow-2xl border border-emerald-500 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-medium whitespace-pre-line leading-relaxed">
              {toastMessage}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-200 hover:text-white text-lg font-bold leading-none p-1"
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
