import React, { useState } from "react";
import { SchoolProfile, TeachingScheduleEntry, LessonPlan, IntegratedTag } from "../types";
import { standardIntegrationsCatalog } from "../data/curriculumData";
import { exportWeekPackageDocx } from "../utils/docxExport";
import { isGVCNSubject, isSpecialistSubject } from "../utils/syncHelper";
import { PhieuCuoiTuanToolbar } from "./PhieuCuoiTuanToolbar";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Tag,
  BookOpen,
  Calendar,
  Layers,
  FileDown,
  RefreshCw,
} from "lucide-react";

interface Props {
  profile: SchoolProfile;
  entries: TeachingScheduleEntry[];
  lessonPlans: LessonPlan[];
  onUpdateEntries: (entries: TeachingScheduleEntry[]) => void;
  onNavigateToKHBD: (lessonTitle?: string) => void;
  onOpenChangeTKBModal?: () => void;
  onNavigateToWorksheetTab?: (subject?: string) => void;
}

export const LichBaoGiangView: React.FC<Props> = ({
  profile,
  entries,
  lessonPlans,
  onUpdateEntries,
  onNavigateToKHBD,
  onOpenChangeTKBModal,
  onNavigateToWorksheetTab,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editPPCT, setEditPPCT] = useState<string | number>("");
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editIntegrationNote, setEditIntegrationNote] = useState("");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagModalEntryId, setTagModalEntryId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "gvcn" | "specialist">("all");

  const daysOrder = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  const gvcnEntriesCount = entries.filter((e) => isGVCNSubject(e.subject, e.specialistTeacherName)).length;
  const specialistEntriesCount = entries.filter((e) => isSpecialistSubject(e.subject, e.specialistTeacherName)).length;

  const displayEntries = entries.filter((e) => {
    if (roleFilter === "gvcn") return isGVCNSubject(e.subject, e.specialistTeacherName);
    if (roleFilter === "specialist") return isSpecialistSubject(e.subject, e.specialistTeacherName);
    return true;
  });

  const handleStartEdit = (item: TeachingScheduleEntry) => {
    setEditingId(item.id);
    setEditSubject(item.subject);
    setEditPPCT(item.ppct || "");
    setEditLessonTitle(item.lessonTitle);
    setEditIntegrationNote(item.integrationNote || "");
  };

  const handleSaveEdit = (id: string) => {
    const updated = entries.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          subject: editSubject,
          ppct: editPPCT,
          lessonTitle: editLessonTitle,
          integrationNote: editIntegrationNote,
        };
      }
      return item;
    });
    onUpdateEntries(updated);
    setEditingId(null);
  };

  const handleOpenTagModal = (id: string) => {
    setTagModalEntryId(id);
    setIsTagModalOpen(true);
  };

  const handleAddTagToEntry = (tag: IntegratedTag) => {
    if (!tagModalEntryId) return;
    const target = entries.find((e) => e.id === tagModalEntryId);
    if (!target) return;

    const tagText = `${tag.code ? `Tích hợp ${tag.code}: ` : `Tích hợp ${tag.title}: `}${tag.description}`;
    const newNote = target.integrationNote
      ? `${target.integrationNote}\n${tagText}`
      : tagText;

    const updated = entries.map((item) =>
      item.id === tagModalEntryId ? { ...item, integrationNote: newNote } : item
    );
    onUpdateEntries(updated);
    setIsTagModalOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tiết dạy này khỏi Lịch Báo Giảng?")) {
      onUpdateEntries(entries.filter((e) => e.id !== id));
    }
  };

  // Export full package (LBG as Page 1 + All KHBD) according to role filter
  const handleExportFullPackage = () => {
    const filteredPlans = lessonPlans.filter((p) => {
      if (roleFilter === "gvcn") return isGVCNSubject(p.subject, p.specialistTeacherName || p.teacherName);
      if (roleFilter === "specialist") return isSpecialistSubject(p.subject, p.specialistTeacherName || p.teacherName);
      return true;
    });

    exportWeekPackageDocx(profile, displayEntries, filteredPlans, {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: true,
      targetRole: roleFilter === "gvcn" ? "gvcn" : roleFilter === "specialist" ? "specialist" : "all",
      customTeacherName: roleFilter === "gvcn" ? profile.teacherName : undefined,
    });
  };

  // Export LBG only according to role filter
  const handleExportLBGOnly = () => {
    exportWeekPackageDocx(profile, displayEntries, [], {
      fontSize: profile.fontSize,
      fontFamily: "Times New Roman",
      includeLBGPage1: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Fast Export Tools */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Lịch Báo Giảng Tuần {profile.currentWeek} (Chuẩn 7 tiết/ngày)
            </h2>
            <p className="text-xs text-slate-500">
              {profile.schoolName} • Lớp: <strong className="text-slate-700">{profile.className}</strong> • GV: <strong className="text-slate-700">{profile.teacherName}</strong>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenChangeTKBModal && (
            <button
              onClick={onOpenChangeTKBModal}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Đổi TKB mới và tự động đồng bộ sang Lịch Báo Giảng & KHBD"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Thay Đổi TKB Mới</span>
            </button>
          )}

          <button
            onClick={handleExportLBGOnly}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {roleFilter === "gvcn"
                ? "Xuất LBG GVCN (.docx)"
                : roleFilter === "specialist"
                ? "Xuất LBG GV Chuyên (.docx)"
                : "Xuất LBG Đơn Lẻ (.docx)"}
            </span>
          </button>

          <button
            onClick={handleExportFullPackage}
            className={`px-4 py-2 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              roleFilter === "specialist"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            title="Xuất file Word cả tuần: Trang 1 là Lịch Báo Giảng, tiếp theo là toàn bộ Kế Hoạch Bài Dạy (KHBD)"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>
              {roleFilter === "gvcn"
                ? "Tải KHBD GVCN (Trang 1 là LBG)"
                : roleFilter === "specialist"
                ? "Tải KHBD GV Chuyên (Trang 1 là LBG)"
                : "Tải KHBD (Trang 1 là LBG)"}{" "}
              (.docx)
            </span>
          </button>
        </div>
      </div>

      {/* Thanh Tải Các Phiếu Bài Tập Trắc Nghiệm Cuối Tuần (Loigiaihay.com) */}
      <PhieuCuoiTuanToolbar
        profile={profile}
        lbgEntries={entries}
        onNavigateToWorksheetTab={onNavigateToWorksheetTab}
      />

      {/* Role Filter Tabs (GVCN vs GV Chuyên) */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 ml-1">Lọc phân công:</span>
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả các môn ({entries.length} tiết)
          </button>

          <button
            onClick={() => setRoleFilter("gvcn")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === "gvcn"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            <span>👩‍🏫 Môn GVCN phụ trách ({gvcnEntriesCount} tiết)</span>
          </button>

          <button
            onClick={() => setRoleFilter("specialist")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === "specialist"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            <span>🎨 Môn GV Chuyên môn ({specialistEntriesCount} tiết)</span>
          </button>
        </div>

        {roleFilter !== "all" && (
          <div className="text-xs text-slate-500 italic pr-2">
            Đang lọc hiển thị cho {roleFilter === "gvcn" ? "Giáo viên chủ nhiệm" : "Giáo viên chuyên biệt"}
          </div>
        )}
      </div>

      {/* Main LBG Table Document Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-6">
        {/* Clean Document Title (No UBND / National motto as requested) */}
        <div className="text-center mb-5 pb-4 border-b border-slate-100">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            LỊCH BÁO GIẢNG TUẦN {profile.currentWeek}
          </h1>
          <p className="text-xs text-slate-500 italic mt-1 font-medium">
            Từ ngày {profile.weekStartDate} đến ngày {profile.weekEndDate} — Năm học {profile.schoolYear}
          </p>
          <div className="mt-2 text-xs font-semibold text-slate-700 flex items-center justify-center gap-4 flex-wrap">
            <span>Trường: <strong className="text-slate-900">{profile.schoolName || "TIỂU HỌC MỸ LẠC"}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Khối {profile.grade} - Lớp: <strong className="text-slate-900">{profile.className}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Giáo viên: <strong className="text-blue-700">{profile.teacherName}</strong></span>
          </div>
        </div>

        {/* LBG Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300 text-center">
                <th className="border border-slate-300 px-3 py-2.5 w-24">Thứ / Ngày</th>
                <th className="border border-slate-300 px-2 py-2.5 w-28">Buổi</th>
                <th className="border border-slate-300 px-2 py-2.5 w-12">Tiết</th>
                <th className="border border-slate-300 px-3 py-2.5 w-32">Môn học / Phân môn</th>
                <th className="border border-slate-300 px-2 py-2.5 w-16">Tiết PPCT</th>
                <th className="border border-slate-300 px-3 py-2.5 min-w-[220px]">
                  Tên bài dạy / Hoạt động giáo dục
                </th>
                <th className="border border-slate-300 px-3 py-2.5 w-40">
                  Ghi chú
                </th>
                <th className="border border-slate-300 px-2 py-2.5 w-16">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {daysOrder.map((day) => {
                const dayEntries = displayEntries.filter((e) => e.dayOfWeek === day);
                if (dayEntries.length === 0) return null;

                // Sort: Sáng first, then Chiều
                dayEntries.sort((a, b) => {
                  if (a.session === b.session) return a.periodInDay - b.periodInDay;
                  return a.session === "Sáng" ? -1 : 1;
                });

                const morningEntries = dayEntries.filter((e) => e.session === "Sáng");
                const afternoonEntries = dayEntries.filter((e) => e.session === "Chiều");

                return dayEntries.map((item, index) => {
                  const isFirstInDay = index === 0;
                  const isFirstMorning = morningEntries.length > 0 && item.id === morningEntries[0].id;
                  const isFirstAfternoon = afternoonEntries.length > 0 && item.id === afternoonEntries[0].id;
                  const isEditing = editingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.session === "Sáng" ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Day Column (Spanned or First in Day) */}
                      {isFirstInDay ? (
                        <td
                          rowSpan={dayEntries.length}
                          className="border border-slate-300 px-2.5 py-2 text-center font-bold text-slate-800 bg-slate-50/70 align-top"
                        >
                          <div className="sticky top-24">
                            <div>{item.dayOfWeek}</div>
                            <div className="text-[11px] text-slate-500 font-normal mt-0.5">{item.dateStr}</div>
                          </div>
                        </td>
                      ) : null}

                      {/* Buổi: Ghi 1 lần "Buổi thứ nhất" cho 4 tiết sáng và 1 lần "Buổi thứ hai" cho 3 tiết chiều */}
                      {item.session === "Sáng" && isFirstMorning ? (
                        <td
                          rowSpan={morningEntries.length}
                          className="border border-slate-300 px-2.5 py-2 text-center font-semibold text-slate-700 bg-slate-50/60 align-middle leading-snug"
                        >
                          Buổi thứ nhất
                        </td>
                      ) : item.session === "Chiều" && isFirstAfternoon ? (
                        <td
                          rowSpan={afternoonEntries.length}
                          className="border border-slate-300 px-2.5 py-2 text-center font-semibold text-slate-700 bg-slate-100/60 align-middle leading-snug"
                        >
                          Buổi thứ hai
                        </td>
                      ) : item.session !== "Sáng" && item.session !== "Chiều" ? (
                        <td className="border border-slate-300 px-2 py-2 text-center font-semibold text-slate-700 align-middle">
                          {item.session}
                        </td>
                      ) : null}

                      {/* Period in Day */}
                      <td className="border border-slate-300 px-2 py-2 text-center font-bold text-slate-700">
                        {item.periodInDay}
                      </td>

                      {/* Subject */}
                      <td className="border border-slate-300 px-3 py-2 font-bold text-slate-800">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          item.subject
                        )}
                      </td>

                      {/* PPCT */}
                      <td className="border border-slate-300 px-2 py-2 text-center text-slate-700 font-semibold">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPPCT}
                            onChange={(e) => setEditPPCT(e.target.value)}
                            className="w-full px-1 py-1 border border-slate-300 rounded text-xs text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          item.ppct || "-"
                        )}
                      </td>

                      {/* Lesson Title */}
                      <td className="border border-slate-300 px-3 py-2 text-slate-900 font-medium">
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={editLessonTitle}
                            onChange={(e) => setEditLessonTitle(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <div>
                            <div>{item.lessonTitle}</div>
                            {item.isSpecialistPeriod && (
                              <span className="inline-block mt-0.5 text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                GV chuyên đảm nhiệm
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Ghi chú Column (Default Empty) */}
                      <td className="border border-slate-300 px-2.5 py-2 text-slate-700">
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={editIntegrationNote}
                            onChange={(e) => setEditIntegrationNote(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            placeholder="Ghi chú thêm (để trống nếu không cần)..."
                          />
                        ) : (
                          <div className="group relative min-h-[22px] flex items-center justify-between">
                            <span className="text-xs text-slate-700">
                              {item.integrationNote || ""}
                            </span>
                            <button
                              onClick={() => handleOpenTagModal(item.id)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 ml-auto transition-opacity cursor-pointer"
                              title="Thêm ghi chú tích hợp nếu muốn"
                            >
                              <Tag className="w-3 h-3" />
                              <span>Ghi chú</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="border border-slate-300 px-2 py-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1 bg-slate-800 text-white rounded hover:bg-slate-900 cursor-pointer"
                              title="Lưu"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
                              title="Hủy"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                              title="Chỉnh sửa dòng này"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(item.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Xóa dòng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>

        {/* User Rule Confirmation Notice */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">✓ Định dạng tinh gọn:</span>
            <span>
              Lịch Báo Giảng đã được <strong>bỏ các mục Ủy ban, Cộng hòa</strong>, <strong>cột Ghi chú để trống</strong> và sẵn sàng xuất file Word kèm KHBD.
            </span>
          </div>
          <button
            onClick={() => onNavigateToKHBD()}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Xem Kế Hoạch Bài Dạy
          </button>
        </div>
      </div>

      {/* MODAL: CHỌN MẪU TÍCH HỢP CHO TIẾT DẠY */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Thư Viện Tích Hợp Chuẩn (NLS, AI, QPAN, QCN, GDDD, BVMT...)</h3>
              </div>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500">
                Chọn một nội dung tích hợp chuẩn dưới đây để chèn tự động vào tiết dạy của Lịch Báo Giảng:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {standardIntegrationsCatalog.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => handleAddTagToEntry(tag)}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all space-y-1.5 group bg-white shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        {tag.title}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold">
                        {tag.code || tag.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {tag.description}
                    </p>
                    <div className="pt-1 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                      <span>+ Chọn áp dụng</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
