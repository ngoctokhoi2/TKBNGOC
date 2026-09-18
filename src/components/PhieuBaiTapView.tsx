import React, { useState, useEffect } from "react";
import { SchoolProfile, GradeLevel, WeeklyWorksheet, QuizQuestion } from "../types";
import {
  getSubjectsForGrade,
  generateWorksheet,
  subjectThemeColors,
  getLoigiaihaySubjectUrl,
} from "../data/weeklyWorksheetsData";
import {
  exportSingleWorksheetDocx,
  exportWeeklyBundleDocx,
} from "../utils/docxWorksheetExport";
import {
  FileText,
  Download,
  ExternalLink,
  Printer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  initialSubject?: string;
  onUpdateProfile?: (updated: SchoolProfile) => void;
}

export const PhieuBaiTapView: React.FC<Props> = ({
  profile,
  initialSubject,
  onUpdateProfile,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(profile.grade || 2);
  const [selectedWeek, setSelectedWeek] = useState<number>(profile.currentWeek || 1);
  const [selectedBookSeries, setSelectedBookSeries] = useState<string>("Kết nối tri thức với cuộc sống");

  // Get subjects according to selected grade
  const availableSubjects = getSubjectsForGrade(selectedGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubject && availableSubjects.includes(initialSubject)
      ? initialSubject
      : availableSubjects[0]
  );

  // If grade changes and the current subject is no longer valid, switch to first valid subject
  useEffect(() => {
    if (!availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [selectedGrade, availableSubjects, selectedSubject]);

  // Current worksheet data
  const [worksheet, setWorksheet] = useState<WeeklyWorksheet>(() =>
    generateWorksheet(selectedGrade, selectedWeek, selectedSubject, selectedBookSeries)
  );

  // Re-generate worksheet whenever grade, week, subject, or book series changes
  useEffect(() => {
    const ws = generateWorksheet(selectedGrade, selectedWeek, selectedSubject, selectedBookSeries);
    setWorksheet(ws);
    setUserAnswers({});
    setIsGraded(false);
  }, [selectedGrade, selectedWeek, selectedSubject, selectedBookSeries]);

  // Interactive Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [isGraded, setIsGraded] = useState(false);
  const [viewMode, setViewMode] = useState<"interactive" | "preview">("interactive");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);

  // Handle option select
  const handleSelectOption = (questionId: string, optionKey: "A" | "B" | "C" | "D") => {
    if (isGraded) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Calculate score
  const correctCount = worksheet.questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const totalQuestions = worksheet.questions.length;
  const scoreOutOf10 = totalQuestions > 0 ? ((correctCount / totalQuestions) * 10).toFixed(1) : "0";

  // Reset quiz
  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsGraded(false);
  };

  // Export Single Worksheet Docx
  const handleExportDocx = async () => {
    try {
      setIsDownloading(true);
      await exportSingleWorksheetDocx(profile, worksheet, profile.fontSize);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Export Full Bundle
  const handleExportBundle = async () => {
    try {
      setIsDownloadingBundle(true);
      const allWs = availableSubjects.map((s) =>
        generateWorksheet(selectedGrade, selectedWeek, s, selectedBookSeries)
      );
      await exportWeeklyBundleDocx(
        profile,
        allWs,
        selectedWeek,
        selectedGrade,
        profile.fontSize
      );
    } catch (err) {
      console.error("Export bundle error:", err);
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Open Loigiaihay
  const handleOpenLoigiaihay = () => {
    window.open(worksheet.loigiaihayUrl, "_blank", "noopener,noreferrer");
  };

  const colors = subjectThemeColors[selectedSubject] || {
    bg: "bg-blue-600",
    text: "text-blue-700",
    border: "border-blue-200",
    lightBg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Loigiaihay.com Citation & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Phiếu Bài Tập Trắc Nghiệm & Lời Giải Cuối Tuần</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    Tuần {selectedWeek} • Khối {selectedGrade}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Nguồn tham khảo chuẩn:</span>
                  <a
                    href="https://loigiaihay.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline inline-flex items-center gap-1"
                  >
                    <span>https://loigiaihay.com/</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <span>Đầy đủ các bộ sách KNTT, Cánh Diều, Chân Trời Sáng Tạo</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenLoigiaihay}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
              title="Mở chuyên mục bài tập tuần trên trang Loigiaihay.com"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Xem Trên Loigiaihay.com</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-2xs"
              title="In phiếu bài tập trực tiếp"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>In Phiếu</span>
            </button>

            <button
              onClick={handleExportDocx}
              disabled={isDownloading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title={`Tải phiếu bài tập môn ${selectedSubject} Tuần ${selectedWeek} dạng file Word (.docx)`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Đang xuất..." : "Tải Word Môn Này"}</span>
            </button>

            <button
              onClick={handleExportBundle}
              disabled={isDownloadingBundle}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title={`Tải trọn bộ tất cả các môn của Tuần ${selectedWeek} Khối ${selectedGrade} vào 1 file Word`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {isDownloadingBundle
                  ? "Đang đóng gói..."
                  : `Tải Trọn Bộ Tuần ${selectedWeek} (.docx)`}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Strip: Grade, Week, Book Series */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 mr-1">Khối lớp:</span>
            {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Khối {g}
              </button>
            ))}
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Tuần:</span>
            <button
              onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
              disabled={selectedWeek <= 1}
              className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 35 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Tuần {w}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedWeek((w) => Math.min(35, w + 1))}
              disabled={selectedWeek >= 35}
              className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Book Series Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Bộ sách:</span>
            <select
              value={selectedBookSeries}
              onChange={(e) => setSelectedBookSeries(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
              <option value="Cánh diều">Cánh diều</option>
              <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              <option value="Bộ đề ôn chuẩn GDPT 2018">Bộ đề ôn chuẩn GDPT 2018</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subject Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {availableSubjects.map((subj) => {
          const isSelected = selectedSubject === subj;
          const theme = subjectThemeColors[subj] || {
            bg: "bg-blue-600",
            text: "text-blue-700",
            border: "border-blue-200",
            lightBg: "bg-blue-50",
            hoverBg: "hover:bg-blue-100",
          };

          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? `${theme.bg} text-white border-transparent shadow-xs scale-102`
                  : `bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50`
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{subj}</span>
            </button>
          );
        })}
      </div>

      {/* View Mode Switcher: Interactive Quiz vs Printable Document */}
      <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("interactive")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "interactive"
                ? "bg-white text-blue-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Làm Bài Trắc Nghiệm Tương Tác</span>
          </button>

          <button
            onClick={() => setViewMode("preview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "preview"
                ? "bg-white text-blue-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Xem Định Dạng In / Tải Word</span>
          </button>
        </div>

        {viewMode === "interactive" && (
          <div className="flex items-center gap-2 pr-1">
            {isGraded ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Kết quả: {correctCount}/{totalQuestions} câu đúng ({scoreOutOf10}/10 đ)
                  </span>
                </span>
                <button
                  onClick={handleResetQuiz}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Làm lại</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsGraded(true)}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nộp Bài & Chấm Điểm</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Worksheet Content Display */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        {/* Printable Header Layout */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3 font-semibold text-slate-700">
            <div>
              <div>{profile.districtDepartment || "PHÒNG GD&ĐT HUYỆN TÂN THẠNH"}</div>
              <div className="font-bold text-slate-900">{profile.schoolName || "TRƯỜNG TIỂU HỌC TÂN THẠNH"}</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="italic text-slate-600">Độc lập - Tự do - Hạnh phúc</div>
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-blue-950 uppercase tracking-wide">
            PHIẾU BÀI TẬP CUỐI TUẦN {worksheet.week}
          </h2>
          <div className="text-sm font-bold text-slate-700 mt-1">
            Môn: {worksheet.subject.toUpperCase()} - KHỐI {worksheet.grade}
          </div>
          <div className="text-xs text-slate-500 italic mt-0.5">
            (Bộ sách: {worksheet.bookSeries} • Nguồn: loigiaihay.com)
          </div>

          {/* Student metadata box */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left">
            <div>
              <span className="font-semibold text-slate-600">Họ và tên học sinh:</span>{" "}
              <span className="text-slate-400 font-mono">...........................................</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Lớp:</span>{" "}
              <span className="font-bold text-slate-800">{profile.className || worksheet.grade + "A"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Điểm / Lời phê:</span>{" "}
              <span className="text-slate-400 font-mono">.......................................</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: TRẮC NGHIỆM */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-4 bg-blue-600 rounded-xs"></span>
              <span>I. Phần Trắc Nghiệm Khách Quan ({worksheet.questions.length} câu)</span>
            </h3>
            <span className="text-xs text-slate-500 italic">
              Khoanh tròn vào chữ cái A, B, C hoặc D trước câu trả lời đúng
            </span>
          </div>

          <div className="space-y-5">
            {worksheet.questions.map((q) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isGraded
                      ? isCorrect
                        ? "bg-emerald-50/70 border-emerald-300"
                        : "bg-rose-50/70 border-rose-300"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Question Prompt */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                      <span className="font-bold text-blue-700 mr-1.5">
                        Câu {q.questionNumber}:
                      </span>
                      <span>{q.questionText}</span>
                    </div>

                    {isGraded && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            <XCircle className="w-3.5 h-3.5" /> Sai (Đáp án: {q.correctAnswer})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt) => {
                      const isChosen = selectedOpt === opt.key;
                      const isCorrectChoice = opt.key === q.correctAnswer;

                      let optClass = "bg-white border-slate-200 hover:bg-slate-100 text-slate-800";
                      if (viewMode === "interactive") {
                        if (isGraded) {
                          if (isCorrectChoice) {
                            optClass = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
                          } else if (isChosen && !isCorrect) {
                            optClass = "bg-rose-100 border-rose-400 text-rose-950 line-through";
                          }
                        } else if (isChosen) {
                          optClass = "bg-blue-600 border-blue-600 text-white font-bold shadow-xs";
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          className={`p-2.5 rounded-lg border text-xs text-left flex items-start gap-2 transition-all cursor-pointer ${optClass}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                              isChosen && !isGraded
                                ? "bg-white text-blue-700 border-white"
                                : isGraded && isCorrectChoice
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="mt-0.5 leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (Shown when graded or in preview mode) */}
                  {(isGraded || viewMode === "preview") && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-700 flex items-start gap-2 bg-white/80 p-2.5 rounded-lg">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">
                          Lời giải chi tiết (Loigiaihay):
                        </span>{" "}
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: TỰ LUẬN / THỰC HÀNH */}
        {worksheet.essayExercises && worksheet.essayExercises.length > 0 && (
          <div className="mb-8 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-4 bg-emerald-600 rounded-xs"></span>
                <span>II. Phần Tự Luận & Thực Hành Vận Dụng</span>
              </h3>
              <span className="text-xs text-slate-500 italic">
                Trình bày bài làm chi tiết
              </span>
            </div>

            <div className="space-y-5">
              {worksheet.essayExercises.map((e) => (
                <div
                  key={e.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="text-sm font-bold text-slate-900 mb-1.5">
                    Bài {e.exerciseNumber}: {e.title}
                  </div>
                  <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed mb-4">
                    {e.prompt}
                  </div>

                  {/* Writing Lines or Solution */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hướng dẫn giải chi tiết (Theo Loigiaihay.com):</span>
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                      {e.solution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER NOTICE */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Thầy cô có thể tải trọn bộ phiếu bài tập tuần này về máy tính bằng file Word (.docx) chuẩn font 12-14 pt, sẵn sàng in ấn và phát cho học sinh làm vào cuối tuần.
            </span>
          </div>
          <button
            onClick={handleExportDocx}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Word Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
