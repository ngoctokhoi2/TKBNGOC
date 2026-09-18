import React from "react";
import { SchoolProfile, GradeLevel, TeacherInfo } from "../types";
import { Layers, UserCheck, Calendar, Type, Sliders, GraduationCap } from "lucide-react";

interface Props {
  profile: SchoolProfile;
  teachers: TeacherInfo[];
  classList: string[];
  onUpdateProfile: (updated: Partial<SchoolProfile>) => void;
  onOpenSettings: () => void;
  selectedTeacherId: string;
  onSelectTeacher: (teacherId: string) => void;
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
}

export const HeaderInfoBar: React.FC<Props> = ({
  profile,
  teachers,
  classList,
  onUpdateProfile,
  onOpenSettings,
  selectedTeacherId,
  onSelectTeacher,
  selectedClassId,
  onSelectClass,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Grade Level Switcher (Khối 1, 2, 3, 4, 5 buttons) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Khối:
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              {([1, 2, 3, 4, 5] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => {
                    const firstClassOfGrade = `${grade}A`;
                    onUpdateProfile({
                      grade,
                      className: firstClassOfGrade,
                      departmentGroup: `TỔ CHUYÊN MÔN KHỐI ${grade}`,
                    });
                    onSelectClass(firstClassOfGrade);
                    // Match default teacher for that grade if available
                    const matchedTeacher = teachers.find((t) => t.assignedClass === firstClassOfGrade);
                    if (matchedTeacher) {
                      onSelectTeacher(matchedTeacher.id);
                      onUpdateProfile({ teacherName: matchedTeacher.name });
                    }
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    profile.grade === grade
                      ? "bg-white shadow-xs text-blue-600 border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  Khối {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Class & Teacher & Week Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Class Selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Lớp:</span>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  const newClass = e.target.value;
                  onSelectClass(newClass);
                  const gradeNum = parseInt(newClass.charAt(0), 10) as GradeLevel;
                  onUpdateProfile({
                    className: newClass,
                    grade: gradeNum,
                    departmentGroup: `TỔ CHUYÊN MÔN KHỐI ${gradeNum}`,
                  });
                  const matchedTeacher = teachers.find((t) => t.assignedClass === newClass);
                  if (matchedTeacher) {
                    onSelectTeacher(matchedTeacher.id);
                    onUpdateProfile({ teacherName: matchedTeacher.name });
                  }
                }}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {classList.map((cls) => (
                  <option key={cls} value={cls}>
                    Lớp {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Giáo viên:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => {
                  const tId = e.target.value;
                  onSelectTeacher(tId);
                  const found = teachers.find((t) => t.id === tId);
                  if (found) {
                    onUpdateProfile({
                      teacherName: found.name,
                      className: found.assignedClass || profile.className,
                    });
                    if (found.assignedClass) {
                      onSelectClass(found.assignedClass);
                    }
                  }
                }}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                <optgroup label="Giáo viên Chủ nhiệm">
                  {teachers
                    .filter((t) => !t.isSpecialist)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.assignedClass || t.role})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Giáo viên Chuyên môn">
                  {teachers
                    .filter((t) => t.isSpecialist)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subjectSpecialty || t.role})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Week Selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Tuần:</span>
              <select
                value={profile.currentWeek}
                onChange={(e) => onUpdateProfile({ currentWeek: parseInt(e.target.value, 10) || 1 })}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 35 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Tuần {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Selector for Word */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 px-1">Word:</span>
              {([12, 13, 14] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onUpdateProfile({ fontSize: sz })}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    profile.fontSize === sz
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                  title={`Cỡ chữ Word ${sz}pt`}
                >
                  Font {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Quick School Info button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Thiết lập trường & GV</span>
            </button>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
          <div className="flex items-center gap-3">
            <span>
              Trường: <strong className="text-slate-700">{profile.schoolName}</strong> {profile.branchName ? `(${profile.branchName})` : ""}
            </span>
            <span>
              GV: <strong className="text-slate-700">{profile.teacherName}</strong>
            </span>
            <span>
              Lớp: <strong className="text-slate-700">{profile.className}</strong>
            </span>
          </div>
          <div>
            <span>
              Thời gian: <strong className="text-slate-700">{profile.weekStartDate}</strong> đến <strong className="text-slate-700">{profile.weekEndDate}</strong> (Năm học {profile.schoolYear})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
