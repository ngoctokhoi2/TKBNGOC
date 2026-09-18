import React, { useState } from "react";
import { SchoolProfile, LessonPlan, GradeLevel, DayOfWeek, IntegratedTag } from "../types";
import { standardIntegrationsCatalog } from "../data/curriculumData";
import { exportWeekPackageDocx } from "../utils/docxExport";
import { knownSpecialistsList } from "../utils/syncHelper";
import {
  Sparkles,
  BookOpen,
  Check,
  Download,
  Plus,
  RefreshCw,
  Tag,
  Layers,
  Calendar,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  initialSubject?: string;
  initialLessonTitle?: string;
  initialDay?: DayOfWeek;
  initialTeacherRole?: "gvcn" | "specialist";
  initialTeacherName?: string;
  onSaveToWeeklyPlan: (plan: LessonPlan) => void;
  onClose?: () => void;
}

export const AIKHBDGenerator: React.FC<Props> = ({
  profile,
  initialSubject = "Toán",
  initialLessonTitle = "Bảng nhân 9 (Tiết 1)",
  initialDay = "Thứ Hai",
  initialTeacherRole = "gvcn",
  initialTeacherName,
  onSaveToWeeklyPlan,
  onClose,
}) => {
  const [teacherRole, setTeacherRole] = useState<"gvcn" | "specialist">(initialTeacherRole);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>(
    initialTeacherName || "Cô Nương"
  );
  const [grade, setGrade] = useState<GradeLevel>(profile.grade || 2);
  const [subject, setSubject] = useState(initialSubject);
  const [lessonTitle, setLessonTitle] = useState(initialLessonTitle);
  const [topic, setTopic] = useState("");
  const [period, setPeriod] = useState("Tiết 1");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialDay);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([
    "nls-basic",
    "ai-awareness",
    "stem-apply",
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectSpecialist = (spName: string) => {
    setSelectedSpecialist(spName);
    const found = knownSpecialistsList.find((s) => s.name === spName);
    if (found) {
      setSubject(found.subject);
    }
  };

  const handleSelectRole = (role: "gvcn" | "specialist") => {
    setTeacherRole(role);
    if (role === "gvcn") {
      setSubject("Toán");
    } else {
      const found = knownSpecialistsList.find((s) => s.name === selectedSpecialist) || knownSpecialistsList[0];
      setSubject(found.subject);
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleGenerate = async () => {
    if (!lessonTitle.trim()) {
      alert("Vui lòng nhập Tên bài dạy!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    // Gather selected tags descriptions
    const chosenTags = standardIntegrationsCatalog
      .filter((t) => selectedTagIds.includes(t.id))
      .map((t) => `${t.title}: ${t.description}`);

    try {
      const res = await fetch("/api/gemini/generate-khbd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          lessonTitle,
          topic,
          period,
          week: profile.currentWeek,
          dayOfWeek,
          integrations: chosenTags,
          profile,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const isSpec = teacherRole === "specialist";
        const teacherDisplayName = isSpec ? selectedSpecialist : profile.teacherName;

        const planResult: LessonPlan = {
          id: `plan-${Date.now()}`,
          grade,
          subject,
          lessonTitle,
          topic: topic || undefined,
          period,
          week: profile.currentWeek,
          dayOfWeek,
          teacherName: teacherDisplayName,
          isSpecialist: isSpec,
          specialistTeacherName: isSpec ? selectedSpecialist : undefined,
          objectives: data.data.objectives || {
            specificCompetencies: [],
            generalCompetencies: [],
            qualities: [],
          },
          equipment: data.data.equipment || {
            teacher: "Kế hoạch bài dạy, SGK, máy chiếu, bảng phụ.",
            students: "SGK, vở ghi, dụng cụ học tập.",
          },
          integratedContent: chosenTags.join("; "),
          integratedTags: standardIntegrationsCatalog
            .filter((t) => selectedTagIds.includes(t.id))
            .map((t) => t.code || t.title),
          activities: data.data.activities || [],
          adjustment: data.data.adjustment || "",
        };

        setGeneratedPlan(planResult);
      } else {
        throw new Error(data.error || "Không thể tạo KHBD tự động.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi trong quá trình tạo giáo án. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndExport = (exportNow: boolean = false) => {
    if (!generatedPlan) return;
    onSaveToWeeklyPlan(generatedPlan);
    if (exportNow) {
      exportWeekPackageDocx(profile, [], [generatedPlan], {
        fontSize: profile.fontSize,
        fontFamily: "Times New Roman",
        includeLBGPage1: false,
        targetRole: generatedPlan.isSpecialist ? "specialist" : "gvcn",
        customTeacherName: generatedPlan.teacherName,
        customSubjectName: generatedPlan.subject,
      });
    }
    alert("Đã lưu Kế hoạch bài dạy vào danh sách tuần thành công!");
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 text-slate-800 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Trợ Lý AI Soạn Kế Hoạch Bài Dạy Chuẩn CV 2345</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động tích hợp đa liên môn: Năng lực số (CV 3456), Trí tuệ nhân tạo (AI), Quốc phòng an ninh (TT 08/2024), Quyền con người, STEM, Dinh dưỡng...
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              1. Giáo Viên Soạn Giảng (Phân Quyền Riêng Biệt)
            </h3>

            {/* Role Radio Group */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole("gvcn")}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  teacherRole === "gvcn"
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400/20 text-blue-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>👩‍🏫</span>
                  <span>GV Chủ Nhiệm</span>
                </div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5 truncate">
                  {profile.teacherName} (Lớp {profile.className})
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("specialist")}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  teacherRole === "specialist"
                    ? "bg-purple-50 border-purple-500 ring-2 ring-purple-400/20 text-purple-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>🎨</span>
                  <span>GV Chuyên Môn</span>
                </div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5 truncate">
                  {selectedSpecialist}
                </div>
              </button>
            </div>

            {/* If specialist, select teacher */}
            {teacherRole === "specialist" && (
              <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg space-y-1.5">
                <label className="block text-[11px] font-bold text-purple-900">
                  Chọn Giáo Viên Chuyên Môn Phụ Trách:
                </label>
                <select
                  value={selectedSpecialist}
                  onChange={(e) => handleSelectSpecialist(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-purple-300 rounded-md bg-white text-purple-900 font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
                >
                  {knownSpecialistsList.map((sp) => (
                    <option key={sp.id} value={sp.name}>
                      {sp.icon} {sp.name} — Môn: {sp.subject} ({sp.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pt-2 pb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              2. Thông Tin Bài Dạy & Khối Lớp
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khối Lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
                >
                  <option value={1}>Khối 1</option>
                  <option value={2}>Khối 2</option>
                  <option value={3}>Khối 3</option>
                  <option value={4}>Khối 4</option>
                  <option value={5}>Khối 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thứ trong tuần:</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="Thứ Hai">Thứ Hai</option>
                  <option value="Thứ Ba">Thứ Ba</option>
                  <option value="Thứ Tư">Thứ Tư</option>
                  <option value="Thứ Năm">Thứ Năm</option>
                  <option value="Thứ Sáu">Thứ Sáu</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="VD: Toán, Tiếng Việt..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiết:</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="VD: Tiết 1, Tiết 2..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên bài dạy:</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="VD: Ôn tập về số tự nhiên, Luyện từ và câu..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chủ đề / Bài học (nếu có):</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Chủ điểm: Khám phá thế giới..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Integration Selection Checklist */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-600" />
                3. Lựa Chọn Nội Dung Tích Hợp
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                Đã chọn: {selectedTagIds.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {standardIntegrationsCatalog.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <div
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-400 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by div click
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">{tag.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold border border-slate-200">
                            {tag.code || tag.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug mt-1 line-clamp-2">
                          {tag.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-md text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang soạn KHBD chi tiết bằng AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Soạn Kế Hoạch Bài Dạy Bằng AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Preview & Actions */}
        <div className="lg:col-span-7 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {generatedPlan ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
              {/* Header inside plan card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold text-xs">
                    Khối {generatedPlan.grade} • {generatedPlan.dayOfWeek}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {generatedPlan.subject} ({generatedPlan.period}): {generatedPlan.lessonTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveAndExport(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Lưu Vào Tuần Này
                  </button>

                  <button
                    onClick={() => handleSaveAndExport(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    title="Lưu vào tuần và tải file Word ngay"
                  >
                    <Download className="w-4 h-4" />
                    Lưu & Tải Word
                  </button>
                </div>
              </div>

              {/* Integrated Notice */}
              {generatedPlan.integratedContent && (
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900">
                  <strong className="text-blue-800">Tích hợp đã lồng ghép:</strong> {generatedPlan.integratedContent}
                </div>
              )}

              {/* I. Objectives */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">I. Yêu Cầu Cần Đạt</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <strong className="text-slate-900 block mb-1">Năng lực đặc thù:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {generatedPlan.objectives.specificCompetencies.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <strong className="text-slate-900 block mb-1">Năng lực chung:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {generatedPlan.objectives.generalCompetencies.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <strong className="text-slate-900 block mb-1">Phẩm chất:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {generatedPlan.objectives.qualities.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* II. Equipment */}
              <div className="space-y-1 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase">II. Đồ Dùng Dạy Học</h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                  <div>
                    <strong className="text-slate-900">GV:</strong> {generatedPlan.equipment.teacher}
                  </div>
                  <div>
                    <strong className="text-slate-900">HS:</strong> {generatedPlan.equipment.students}
                  </div>
                </div>
              </div>

              {/* III. 2-Column Activities Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  III. Các Hoạt Động Dạy Học Chủ Yếu (2 Cột Chuẩn CV 2345)
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
                      {generatedPlan.activities.map((act, idx) => (
                        <React.Fragment key={idx}>
                          <tr className="bg-slate-100 border-y border-slate-300">
                            <td colSpan={2} className="px-3 py-1.5 font-bold text-slate-900">
                              ★ {act.title} {act.time && `(${act.time})`}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200 align-top">
                            <td className="p-3 border-r border-slate-300 whitespace-pre-line text-slate-700 leading-relaxed">
                              {act.teacherActivity}
                            </td>
                            <td className="p-3 whitespace-pre-line text-slate-700 leading-relaxed">
                              {act.studentActivity}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Khung Xem Trước Kế Hoạch Bài Dạy</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Điền thông tin và lựa chọn các nội dung tích hợp (Năng lực số, AI, GDQPAN, Quyền con người...) ở cột bên trái rồi bấm <strong>"Soạn Kế Hoạch Bài Dạy Bằng AI"</strong> để tạo bài dạy hoàn chỉnh theo đúng Công văn 2345/BGDĐT.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
