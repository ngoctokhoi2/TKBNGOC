import React from "react";
import { SchoolProfile } from "../types";
import {
  Calendar,
  FileText,
  BookOpen,
  Sparkles,
  Download,
  School,
  Sliders,
  CheckSquare,
} from "lucide-react";

interface Props {
  activeTab: "timetable" | "lbg" | "khbd" | "ai_khbd" | "phieu_cuoi_tuan";
  setActiveTab: (tab: "timetable" | "lbg" | "khbd" | "ai_khbd" | "phieu_cuoi_tuan") => void;
  profile: SchoolProfile;
  onOpenSettings: () => void;
  onQuickExportWeek: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenSettings,
  onQuickExportWeek,
}) => {
  return (
    <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base md:text-lg tracking-tight text-slate-900 flex items-center gap-2">
                <span>EduPlan Pro</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  CV 2345/BGDĐT
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium hidden md:block">
                Quản lý TKB, Lịch báo giảng & KHBD Tích hợp số • AI • QPAN • QCN
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Segmented pill control */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("timetable")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "timetable"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thời Khóa Biểu</span>
              <span className="sm:hidden">TKB</span>
            </button>

            <button
              onClick={() => setActiveTab("lbg")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "lbg"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lịch Báo Giảng</span>
              <span className="sm:hidden">LBG</span>
            </button>

            <button
              onClick={() => setActiveTab("khbd")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "khbd"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kế Hoạch Bài Dạy</span>
              <span className="sm:hidden">KHBD</span>
            </button>

            <button
              onClick={() => setActiveTab("phieu_cuoi_tuan")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "phieu_cuoi_tuan"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Phiếu Cuối Tuần</span>
              <span className="sm:hidden">Phiếu</span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1 rounded-sm hidden lg:inline">
                Loigiaihay
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ai_khbd")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "ai_khbd"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden md:inline">Trợ Lý AI KHBD</span>
              <span className="md:hidden">AI Soạn</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickExportWeek}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Xuất file Word (.docx) toàn bộ tuần (LBG Trang 1 + KHBD)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tải Nguyên Tuần (.docx)</span>
              <span className="md:hidden">Tải Tuần</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
