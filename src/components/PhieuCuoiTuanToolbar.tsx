import React, { useState } from "react";
import { SchoolProfile, TeachingScheduleEntry } from "../types";
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
  CheckCircle,
  Eye,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  lbgEntries?: TeachingScheduleEntry[];
  onNavigateToWorksheetTab?: (subject?: string) => void;
}

export const PhieuCuoiTuanToolbar: React.FC<Props> = ({
  profile,
  lbgEntries = [],
  onNavigateToWorksheetTab,
}) => {
  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);

  const currentGrade = profile.grade || 2;
  const currentWeek = profile.currentWeek || 1;
  const subjects = getSubjectsForGrade(currentGrade);

  // Check which subjects are present in the current week's LBG
  const lbgSubjectSet = new Set(
    lbgEntries.map((e) => e.subject.toLowerCase().trim())
  );

  const isSubjectInLBG = (subj: string) => {
    const s = subj.toLowerCase().trim();
    if (lbgSubjectSet.has(s)) return true;
    for (const lbgSubj of lbgSubjectSet) {
      if (lbgSubj.includes(s) || s.includes(lbgSubj)) return true;
    }
    return false;
  };

  // Quick single subject docx download
  const handleQuickDownload = async (subj: string) => {
    try {
      setDownloadingSubject(subj);
      const ws = generateWorksheet(currentGrade, currentWeek, subj);
      await exportSingleWorksheetDocx(profile, ws, profile.fontSize);
    } catch (err) {
      console.error("Error downloading worksheet:", err);
    } finally {
      setDownloadingSubject(null);
    }
  };

  // Download all subjects of the week in one single docx
  const handleDownloadBundle = async () => {
    try {
      setIsDownloadingBundle(true);
      const worksheets = subjects.map((subj) =>
        generateWorksheet(currentGrade, currentWeek, subj)
      );
      await exportWeeklyBundleDocx(
        profile,
        worksheets,
        currentWeek,
        currentGrade,
        profile.fontSize
      );
    } catch (err) {
      console.error("Error downloading bundle:", err);
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  // Open direct Loigiaihay link
  const handleOpenLoigiaihay = (subj: string) => {
    const url = getLoigiaihaySubjectUrl(currentGrade, subj, currentWeek);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      id="phieu-cuoi-tuan-toolbar"
      className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-blue-700/50 mb-6 transition-all"
    >
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-700/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide">
                PHIẾU BÀI TẬP TRẮC NGHIỆM CUỐI TUẦN {currentWeek}
              </span>
              <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Khối {currentGrade}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-medium px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-emerald-300" /> Khớp Lịch Báo Giảng
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 mt-0.5">
              Đề trắc nghiệm & tự luận kèm lời giải chi tiết • Nguồn tham khảo:{" "}
              <a
                href="https://loigiaihay.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white font-semibold text-amber-300"
              >
                loigiaihay.com
              </a>
            </p>
          </div>
        </div>

        {/* Global Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {onNavigateToWorksheetTab && (
            <button
              onClick={() => onNavigateToWorksheetTab()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Mở giao diện làm bài tương tác và xem toàn bộ ngân hàng câu hỏi"
            >
              <Eye className="w-3.5 h-3.5 text-blue-300" />
              <span>Xem & Làm Trực Tuyến</span>
            </button>
          )}

          <button
            onClick={handleDownloadBundle}
            disabled={isDownloadingBundle}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title={`Tải trọn bộ tất cả các môn của Tuần ${currentWeek} Khối ${currentGrade} vào 1 file Word (.docx)`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isDownloadingBundle
                ? "Đang đóng gói..."
                : `Tải Trọn Bộ Tuần ${currentWeek} (.docx)`}
            </span>
          </button>
        </div>
      </div>

      {/* Subject Badges / Quick Download Grid */}
      <div className="pt-3">
        <div className="text-[11px] font-semibold text-indigo-200/90 mb-2 flex items-center justify-between">
          <span>
            Chọn môn tải nhanh phiếu Word (.docx) hoặc mở bài tập trên Loigiaihay:
          </span>
          <span className="text-[10px] text-indigo-300 italic">
            {currentGrade <= 3
              ? "Khối 1, 2, 3: Toán • Tiếng Việt • Đạo đức • HĐTN • TNXH"
              : "Khối 4, 5: Toán • Tiếng Việt • Đạo đức • HĐTN • LS & ĐL • Khoa học"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {subjects.map((subj) => {
            const colors = subjectThemeColors[subj] || {
              bg: "bg-slate-700",
              text: "text-slate-200",
              border: "border-slate-600",
              lightBg: "bg-slate-800",
              hoverBg: "hover:bg-slate-700",
            };
            const inLBG = isSubjectInLBG(subj);
            const isDownloading = downloadingSubject === subj;

            return (
              <div
                key={subj}
                className={`bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-2.5 flex flex-col justify-between transition-all group relative overflow-hidden`}
              >
                {/* Top of pill */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="font-bold text-xs text-white truncate group-hover:text-amber-200 transition-colors">
                    {subj}
                  </span>
                  {inLBG && (
                    <span
                      className="text-[9px] bg-emerald-500/80 text-white font-bold px-1.5 py-0.5 rounded shrink-0"
                      title="Môn học có trong Lịch báo giảng tuần này"
                    >
                      Trong LBG
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-indigo-200/70 mb-2.5">
                  Đề tuần {currentWeek} • Kèm đáp án
                </div>

                {/* Actions per subject */}
                <div className="flex items-center gap-1 mt-auto">
                  <button
                    onClick={() => handleQuickDownload(subj)}
                    disabled={isDownloading}
                    className="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    title={`Tải phiếu bài tập Word môn ${subj} Tuần ${currentWeek}`}
                  >
                    <Download className="w-3 h-3" />
                    <span>{isDownloading ? "..." : "Tải Word"}</span>
                  </button>

                  <button
                    onClick={() => handleOpenLoigiaihay(subj)}
                    className="p-1 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-all cursor-pointer"
                    title={`Mở trang bài tập môn ${subj} trên loigiaihay.com`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {onNavigateToWorksheetTab && (
                    <button
                      onClick={() => onNavigateToWorksheetTab(subj)}
                      className="p-1 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-all cursor-pointer"
                      title={`Xem chi tiết câu hỏi & làm trắc nghiệm trực tuyến`}
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
