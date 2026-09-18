import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeightRule,
  PageBreak,
  VerticalMergeType,
} from "docx";
import saveAs from "file-saver";
import { SchoolProfile, TeachingScheduleEntry, LessonPlan, TimetableSlot, DayOfWeek } from "../types";

export interface DocxExportConfig {
  fontSize: 12 | 13 | 14;
  fontFamily: string;
  includeLBGPage1?: boolean;
  targetRole?: "gvcn" | "specialist" | "all";
  customTeacherName?: string;
  customSubjectName?: string;
  customDocumentTitle?: string;
  customSubtitle?: string;
  customFileName?: string;
}

export async function exportWeekPackageDocx(
  profile: SchoolProfile,
  lbgEntries: TeachingScheduleEntry[],
  lessonPlans: LessonPlan[],
  config: DocxExportConfig = { fontSize: 13, fontFamily: "Times New Roman", includeLBGPage1: true }
) {
  const fontHalfPoints = config.fontSize * 2; // docx uses half-points (13pt = 26)
  const fontFamily = config.fontFamily || "Times New Roman";
  const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };

  const teacherDisplayName =
    config.customTeacherName ||
    (config.targetRole === "specialist" ? "Giáo viên chuyên môn" : profile.teacherName);

  const documentTitle =
    config.customDocumentTitle ||
    (config.targetRole === "gvcn"
      ? `KẾ HOẠCH BÀI DẠY TUẦN ${profile.currentWeek} - GIÁO VIÊN CHỦ NHIỆM`
      : config.targetRole === "specialist"
      ? `KẾ HOẠCH BÀI DẠY TUẦN ${profile.currentWeek} - ${
          config.customSubjectName ? `MÔN ${config.customSubjectName.toUpperCase()}` : "GIÁO VIÊN CHUYÊN MÔN"
        }`
      : `KẾ HOẠCH BÀI DẠY CHI TIẾT TUẦN ${profile.currentWeek}`);

  const lbgTitle =
    config.targetRole === "gvcn"
      ? `LỊCH BÁO GIẢNG TUẦN ${profile.currentWeek} (GIÁO VIÊN CHỦ NHIỆM)`
      : config.targetRole === "specialist"
      ? `LỊCH BÁO GIẢNG TUẦN ${profile.currentWeek} (${
          config.customSubjectName ? `MÔN ${config.customSubjectName.toUpperCase()}` : "GIÁO VIÊN CHUYÊN MÔN"
        })`
      : `LỊCH BÁO GIẢNG TUẦN ${profile.currentWeek}`;

  const children: any[] = [];

  // ==========================================
  // PAGE 1: LỊCH BÁO GIẢNG
  // ==========================================
  if (config.includeLBGPage1) {
    // Clean Header for LBG (No UBND / National motto as requested)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: lbgTitle,
            bold: true,
            size: fontHalfPoints + 4,
            font: fontFamily,
          }),
        ],
      })
    );

    // Subtitle & School info
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 40 },
        children: [
          new TextRun({
            text: `Từ ngày ${profile.weekStartDate} đến ngày ${profile.weekEndDate} --- Năm học: ${profile.schoolYear}`,
            italics: true,
            size: fontHalfPoints - 1,
            font: fontFamily,
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 120 },
        children: [
          new TextRun({
            text: `Trường: ${profile.schoolName || "TRƯỜNG TIỂU HỌC MỸ LẠC"}${profile.branchName ? ` (${profile.branchName})` : ""}   |   Lớp: ${profile.className}   |   Giáo viên: ${teacherDisplayName}`,
            bold: true,
            size: fontHalfPoints - 1,
            font: fontFamily,
          }),
        ],
      })
    );

    // LBG Table Header
    const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
    const borders = {
      top: tableBorder,
      bottom: tableBorder,
      left: tableBorder,
      right: tableBorder,
      insideHorizontal: tableBorder,
      insideVertical: tableBorder,
    };

    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        createCell("Thứ / Ngày", { width: 14, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Buổi", { width: 11, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Tiết", { width: 6, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Môn học / Phân môn", { width: 22, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Tiết PPCT", { width: 8, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Tên bài dạy / Hoạt động giáo dục", { width: 27, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Ghi chú", { width: 12, isHeader: true, fontHalfPoints, fontFamily }),
      ],
    });

    const lbgRows: TableRow[] = [headerRow];

    // Group entries by Day
    const daysOrder = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];
    
    for (const day of daysOrder) {
      const dayEntries = lbgEntries.filter((e) => e.dayOfWeek === day);
      if (dayEntries.length === 0) continue;

      // Sort by session (Sáng first, Chiều second), then period
      dayEntries.sort((a, b) => {
        if (a.session === b.session) return a.periodInDay - b.periodInDay;
        return a.session === "Sáng" ? -1 : 1;
      });

      const morningEntries = dayEntries.filter((e) => e.session === "Sáng");
      const afternoonEntries = dayEntries.filter((e) => e.session === "Chiều");

      for (let i = 0; i < dayEntries.length; i++) {
        const item = dayEntries[i];
        const isFirstInDay = i === 0;
        const isFirstMorning = morningEntries.length > 0 && item.id === morningEntries[0].id;
        const isFirstAfternoon = afternoonEntries.length > 0 && item.id === afternoonEntries[0].id;

        lbgRows.push(
          new TableRow({
            children: [
              // Thứ / Ngày (Merged across day)
              isFirstInDay
                ? new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    verticalMerge: VerticalMergeType.RESTART,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.dayOfWeek,
                            bold: true,
                            size: fontHalfPoints - 2,
                            font: fontFamily,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.dateStr || "",
                            size: fontHalfPoints - 4,
                            font: fontFamily,
                          }),
                        ],
                      }),
                    ],
                  })
                : new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    verticalMerge: VerticalMergeType.CONTINUE,
                    children: [],
                  }),

              // Buổi: "Buổi thứ nhất" (Merged for morning) / "Buổi thứ hai" (Merged for afternoon)
              item.session === "Sáng"
                ? isFirstMorning
                  ? new TableCell({
                      width: { size: 11, type: WidthType.PERCENTAGE },
                      verticalMerge: VerticalMergeType.RESTART,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "Buổi thứ nhất",
                              size: fontHalfPoints - 2,
                              font: fontFamily,
                            }),
                          ],
                        }),
                      ],
                    })
                  : new TableCell({
                      width: { size: 11, type: WidthType.PERCENTAGE },
                      verticalMerge: VerticalMergeType.CONTINUE,
                      children: [],
                    })
                : item.session === "Chiều"
                ? isFirstAfternoon
                  ? new TableCell({
                      width: { size: 11, type: WidthType.PERCENTAGE },
                      verticalMerge: VerticalMergeType.RESTART,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "Buổi thứ hai",
                              size: fontHalfPoints - 2,
                              font: fontFamily,
                            }),
                          ],
                        }),
                      ],
                    })
                  : new TableCell({
                      width: { size: 11, type: WidthType.PERCENTAGE },
                      verticalMerge: VerticalMergeType.CONTINUE,
                      children: [],
                    })
                : new TableCell({
                    width: { size: 11, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.session || "",
                            size: fontHalfPoints - 2,
                            font: fontFamily,
                          }),
                        ],
                      }),
                    ],
                  }),

              // Tiết
              new TableCell({
                width: { size: 6, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${item.periodInDay}`,
                        size: fontHalfPoints - 2,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.subject,
                        bold: true,
                        size: fontHalfPoints - 2,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 9, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: item.ppct ? `${item.ppct}` : "-",
                        size: fontHalfPoints - 2,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 27, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.lessonTitle,
                        size: fontHalfPoints - 2,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: item.integrationNote || "",
                        size: fontHalfPoints - 2,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }
    }

    const lbgTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders,
      rows: lbgRows,
    });

    children.push(lbgTable);
    children.push(new Paragraph({ spacing: { before: 100 } }));
  }

  // ==========================================
  // PAGE 2+: KẾ HOẠCH BÀI DẠY (KHBD) CHI TIẾT
  // ==========================================
  if (lessonPlans && lessonPlans.length > 0) {
    if (config.includeLBGPage1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Top Header for KHBD
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 40 },
        children: [
          new TextRun({
            text: documentTitle,
            bold: true,
            size: fontHalfPoints + 4,
            font: fontFamily,
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 120 },
        children: [
          new TextRun({
            text: `Giáo viên: ${teacherDisplayName} | Lớp: ${profile.className} | ${profile.schoolName}`,
            bold: true,
            size: fontHalfPoints,
            font: fontFamily,
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: `Thời gian thực hiện: Từ ngày ${profile.weekStartDate} đến ngày ${profile.weekEndDate}`,
            italics: true,
            size: fontHalfPoints - 1,
            font: fontFamily,
          }),
        ],
      })
    );

    // Render Each Lesson Plan
    for (let idx = 0; idx < lessonPlans.length; idx++) {
      const plan = lessonPlans[idx];
      const isLast = idx === lessonPlans.length - 1;

      // Section Day Header (e.g. ★ THỨ HAI, NGÀY 08/09/2025)
      children.push(
        new Paragraph({
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({
              text: `★ ${plan.dayOfWeek.toUpperCase()}`,
              bold: true,
              color: "1e3a8a",
              size: fontHalfPoints + 1,
              font: fontFamily,
            }),
          ],
        })
      );

      // Subject & Period
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `MÔN: ${plan.subject.toUpperCase()} (${plan.period})`,
              bold: true,
              color: "0f766e",
              size: fontHalfPoints + 1,
              font: fontFamily,
            }),
          ],
        })
      );

      // Lesson Title
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 80 },
          children: [
            new TextRun({
              text: `Bài học: ${plan.lessonTitle}`,
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );

      // Topic if present
      if (plan.topic) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 60 },
            children: [
              new TextRun({
                text: `${plan.topic}`,
                italics: true,
                size: fontHalfPoints - 1,
                font: fontFamily,
              }),
            ],
          })
        );
      }

      // I. YÊU CẦU CẦN ĐẠT
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "I. YÊU CẦU CẦN ĐẠT:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );

      // 1. Năng lực đặc thù
      children.push(
        new Paragraph({
          spacing: { before: 30, after: 20 },
          children: [
            new TextRun({
              text: "1. Năng lực đặc thù:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      (plan.objectives?.specificCompetencies || []).forEach((c) => {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: c.startsWith("-") ? c : `- ${c}`,
                size: fontHalfPoints,
                font: fontFamily,
              }),
            ],
          })
        );
      });

      // 2. Năng lực chung
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({
              text: "2. Năng lực chung:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      (plan.objectives?.generalCompetencies || []).forEach((c) => {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: c.startsWith("-") ? c : `- ${c}`,
                size: fontHalfPoints,
                font: fontFamily,
              }),
            ],
          })
        );
      });

      // 3. Phẩm chất
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({
              text: "3. Phẩm chất:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      (plan.objectives?.qualities || []).forEach((q) => {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: q.startsWith("-") ? q : `- ${q}`,
                size: fontHalfPoints,
                font: fontFamily,
              }),
            ],
          })
        );
      });

      // Tích hợp nổi bật if present
      if (plan.integratedContent) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({
                text: "* Nội dung tích hợp lồng ghép:",
                bold: true,
                italics: true,
                size: fontHalfPoints,
                font: fontFamily,
              }),
            ],
          })
        );
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 20, after: 40 },
            children: [
              new TextRun({
                text: `- ${plan.integratedContent}`,
                italics: true,
                size: fontHalfPoints,
                font: fontFamily,
              }),
            ],
          })
        );
      }

      // II. ĐỒ DÙNG DẠY HỌC VÀ HỌC LIỆU
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "II. ĐỒ DÙNG DẠY HỌC VÀ HỌC LIỆU:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: `- Giáo viên: ${plan.equipment?.teacher || "Kế hoạch bài dạy, SGK, tivi/máy chiếu, đồ dùng trực quan."}`,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { before: 20, after: 60 },
          children: [
            new TextRun({
              text: `- Học sinh: ${plan.equipment?.students || "SGK, vở ghi, bảng con, dụng cụ học tập."}`,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );

      // III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (Bảng 2 cột chuẩn CV 2345)
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({
              text: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU:",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );

      const actHeaderRow = new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "HOẠT ĐỘNG CỦA GIÁO VIÊN",
                    bold: true,
                    size: fontHalfPoints - 1,
                    font: fontFamily,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "HOẠT ĐỘNG CỦA HỌC SINH",
                    bold: true,
                    size: fontHalfPoints - 1,
                    font: fontFamily,
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      const actRows: TableRow[] = [actHeaderRow];

      for (const act of plan.activities || []) {
        // Step title & objective row spanned
        actRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `★ ${act.title}`,
                        bold: true,
                        size: fontHalfPoints,
                        font: fontFamily,
                      }),
                      act.time ? new TextRun({ text: ` (${act.time})`, italics: true, size: fontHalfPoints - 2, font: fontFamily }) : new TextRun({ text: "" }),
                    ],
                  }),
                  act.objective
                    ? new Paragraph({
                        spacing: { before: 20 },
                        children: [
                          new TextRun({
                            text: `Mục tiêu: ${act.objective}`,
                            italics: true,
                            size: fontHalfPoints - 1,
                            font: fontFamily,
                          }),
                        ],
                      })
                    : new Paragraph({ children: [] }),
                ],
              }),
            ],
          })
        );

        // Teacher Activity vs Student Activity 2-column row
        const teacherParas = (act.teacherActivity || "").split("\n").map(
          (line) =>
            new Paragraph({
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: line,
                  size: fontHalfPoints - 1,
                  font: fontFamily,
                }),
              ],
            })
        );
        const studentParas = (act.studentActivity || "").split("\n").map(
          (line) =>
            new Paragraph({
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: line,
                  size: fontHalfPoints - 1,
                  font: fontFamily,
                }),
              ],
            })
        );

        actRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: teacherParas.length > 0 ? teacherParas : [new Paragraph({ children: [] })],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: studentParas.length > 0 ? studentParas : [new Paragraph({ children: [] })],
              }),
            ],
          })
        );
      }

      const activitiesTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: tableBorder,
          bottom: tableBorder,
          left: tableBorder,
          right: tableBorder,
          insideHorizontal: tableBorder,
          insideVertical: tableBorder,
        },
        rows: actRows,
      });

      children.push(activitiesTable);

      // IV. ĐIỀU CHỈNH SAU BÀI DẠY
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: "IV. ĐIỀU CHỈNH SAU BÀI DẠY (NẾU CÓ):",
              bold: true,
              size: fontHalfPoints,
              font: fontFamily,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 120 },
          children: [
            new TextRun({
              text: plan.adjustment || "...........................................................................................................................................................................",
              size: fontHalfPoints - 1,
              font: fontFamily,
            }),
          ],
        })
      );

      // Separator line between lessons
      if (!isLast) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: "------------------------------------------------------------------------------------------------------------------------",
                color: "94a3b8",
                size: fontHalfPoints - 4,
                font: fontFamily,
              }),
            ],
          })
        );
      }
    }
  }

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134, // ~2cm
              left: 1417, // ~2.5cm
              right: 1134, // ~2cm
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  let fileName = config.customFileName;
  if (!fileName) {
    if (config.targetRole === "gvcn") {
      fileName = `KHBD_GVCN_Tuan_${profile.currentWeek}_Lop_${profile.className}_${profile.teacherName.replace(/\s+/g, "_")}.docx`;
    } else if (config.targetRole === "specialist") {
      const spName = (config.customTeacherName || "GV_Chuyen").replace(/\s+/g, "_");
      const subj = (config.customSubjectName || "Mon_Chuyen").replace(/\s+/g, "_");
      fileName = `KHBD_${subj}_${spName}_Tuan_${profile.currentWeek}_${profile.className}.docx`;
    } else {
      fileName = `KHBD_Tuan_${profile.currentWeek}_${profile.className}_${profile.teacherName.replace(/\s+/g, "_")}.docx`;
    }
  }
  saveAs(blob, fileName);
}

export async function exportTimetableDocx(
  profile: SchoolProfile,
  schedule: TimetableSlot[],
  classList: string[],
  config: DocxExportConfig & {
    targetType?: "school" | "class" | "gvcn" | "specialist";
    targetTeacherName?: string;
    targetClassId?: string;
    isSpecialistTeacher?: boolean;
    subjectSpecialty?: string;
  } = { fontSize: 13, fontFamily: "Times New Roman", includeLBGPage1: false }
) {
  const fontHalfPoints = config.fontSize * 2;
  const fontFamily = config.fontFamily || "Times New Roman";
  const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const targetType = config.targetType || "gvcn";
  const days: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  let title = "THỜI KHÓA BIỂU GIẢNG DẠY - GIÁO VIÊN CHỦ NHIỆM";
  let subTitle = `Giáo viên: ${config.targetTeacherName || profile.teacherName} — Lớp: ${config.targetClassId || profile.className} — Năm học: ${profile.schoolYear}`;
  let table: Table;
  let filePrefix = "TKB_GVCN";

  if (targetType === "gvcn" || targetType === "class") {
    // 7-period-per-day table (Sáng 4-5 tiết, Chiều 3 tiết)
    const activeClass = config.targetClassId || profile.className;
    if (targetType === "class") {
      title = `THỜI KHÓA BIỂU LỚP ${activeClass}`;
      subTitle = `GVCN: ${config.targetTeacherName || profile.teacherName} — Năm học: ${profile.schoolYear} | Áp dụng Tuần ${profile.currentWeek}`;
      filePrefix = `TKB_Lop_${activeClass}`;
    } else {
      filePrefix = `TKB_GVCN_${(config.targetTeacherName || profile.teacherName).replace(/\s+/g, "_")}`;
    }

    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        createCell("Buổi", { width: 12, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Tiết", { width: 6, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Thời gian", { width: 14, isHeader: true, fontHalfPoints, fontFamily }),
        ...days.map((d) => createCell(d, { width: 13.6, isHeader: true, fontHalfPoints, fontFamily })),
      ],
    });

    const rows: TableRow[] = [headerRow];

    const morningTimes: Record<number, string> = {
      1: "7h30' - 8h5'",
      2: "8h10' - 8h45'",
      3: "9h15' - 9h50'",
      4: "9h55' - 10h30'",
    };

    const afternoonTimes: Record<number, string> = {
      1: "13h50' - 14h25'",
      2: "14h30' - 15h5'",
      3: "15h25' - 16h",
    };

    // Morning rows (1 - 4) with Ra chơi after period 2
    for (let p = 1; p <= 4; p++) {
      if (p === 3) {
        // Ra chơi row
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                verticalMerge: VerticalMergeType.CONTINUE,
                children: [],
              }),
              new TableCell({
                width: { size: 6, type: WidthType.PERCENTAGE },
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Ra chơi",
                        italics: true,
                        bold: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 14, type: WidthType.PERCENTAGE },
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "8h45' - 9h15'",
                        italics: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                columnSpan: 5,
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Nghỉ giữa giờ / Thể dục giữa giờ (30 phút)",
                        italics: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }

      const dayCells = days.map((day) => {
        const slot = schedule.find((s) => s.day === day && s.session === "Sáng" && s.period === p);
        const cell = slot?.assignments[activeClass];
        const isSpec = cell?.isSpecialist || (cell?.teacher && cell.teacher !== profile.teacherName && !cell.teacher.includes("Ngọc"));
        let text = cell?.subject || "—";
        if (targetType === "gvcn" && isSpec && text !== "—" && text !== "NGHỈ") {
          text = `${text}\n(${cell?.teacher || "GV Chuyên"})`;
        }

        return new TableCell({
          width: { size: 13.6, type: WidthType.PERCENTAGE },
          shading: isSpec ? { fill: "f8fafc" } : undefined,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text,
                  size: fontHalfPoints - 2,
                  font: fontFamily,
                  bold: !isSpec && text !== "—" && text !== "NGHỈ",
                  italics: isSpec,
                }),
              ],
            }),
          ],
        });
      });

      rows.push(
        new TableRow({
          children: [
            p === 1
              ? new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.RESTART,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Buổi thứ nhất\n(Sáng)",
                          bold: true,
                          size: fontHalfPoints - 2,
                          font: fontFamily,
                        }),
                      ],
                    }),
                  ],
                })
              : new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.CONTINUE,
                  children: [],
                }),
            new TableCell({
              width: { size: 6, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${p}`,
                      bold: true,
                      size: fontHalfPoints - 2,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 14, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: morningTimes[p] || "",
                      size: fontHalfPoints - 4,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            ...dayCells,
          ],
        })
      );
    }

    // Afternoon rows (1 - 3) with Ra chơi after period 2
    for (let p = 1; p <= 3; p++) {
      if (p === 3) {
        // Ra chơi row
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                verticalMerge: VerticalMergeType.CONTINUE,
                children: [],
              }),
              new TableCell({
                width: { size: 6, type: WidthType.PERCENTAGE },
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Ra chơi",
                        italics: true,
                        bold: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 14, type: WidthType.PERCENTAGE },
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "15h5' - 15h25'",
                        italics: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                columnSpan: 5,
                shading: { fill: "fef3c7" },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Nghỉ giữa giờ (20 phút)",
                        italics: true,
                        size: fontHalfPoints - 4,
                        font: fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }

      const dayCells = days.map((day) => {
        const slot = schedule.find((s) => s.day === day && s.session === "Chiều" && s.period === p);
        const cell = slot?.assignments[activeClass];
        const isSpec = cell?.isSpecialist || (cell?.teacher && cell.teacher !== profile.teacherName && !cell.teacher.includes("Ngọc"));
        let text = cell?.subject || "—";
        if (targetType === "gvcn" && isSpec && text !== "—" && text !== "NGHỈ") {
          text = `${text}\n(${cell?.teacher || "GV Chuyên"})`;
        }

        return new TableCell({
          width: { size: 13.6, type: WidthType.PERCENTAGE },
          shading: isSpec ? { fill: "f8fafc" } : undefined,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text,
                  size: fontHalfPoints - 2,
                  font: fontFamily,
                  bold: !isSpec && text !== "—" && text !== "NGHỈ",
                  italics: isSpec,
                }),
              ],
            }),
          ],
        });
      });

      rows.push(
        new TableRow({
          children: [
            p === 1
              ? new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.RESTART,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Buổi thứ hai\n(Chiều)",
                          bold: true,
                          size: fontHalfPoints - 2,
                          font: fontFamily,
                        }),
                      ],
                    }),
                  ],
                })
              : new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.CONTINUE,
                  children: [],
                }),
            new TableCell({
              width: { size: 6, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${p}`,
                      bold: true,
                      size: fontHalfPoints - 2,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 14, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: afternoonTimes[p] || "",
                      size: fontHalfPoints - 4,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            ...dayCells,
          ],
        })
      );
    }

    table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: tableBorder,
        bottom: tableBorder,
        left: tableBorder,
        right: tableBorder,
        insideHorizontal: tableBorder,
        insideVertical: tableBorder,
      },
      rows,
    });
  } else if (targetType === "specialist") {
    // Specialist teacher timetable
    const specName = config.targetTeacherName || "Cô Tuệ";
    const specSubject = config.subjectSpecialty || "Môn Chuyên";
    title = `THỜI KHÓA BIỂU GIẢNG DẠY - GIÁO VIÊN CHUYÊN MÔN (${specSubject.toUpperCase()})`;
    subTitle = `Giáo viên: ${specName} — Năm học: ${profile.schoolYear} | Áp dụng từ Tuần ${profile.currentWeek}`;
    filePrefix = `TKB_GV_Chuyen_${specName.replace(/\s+/g, "_")}`;

    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        createCell("Buổi", { width: 12, isHeader: true, fontHalfPoints, fontFamily }),
        createCell("Tiết", { width: 8, isHeader: true, fontHalfPoints, fontFamily }),
        ...days.map((d) => createCell(d, { width: 16, isHeader: true, fontHalfPoints, fontFamily })),
      ],
    });

    const rows: TableRow[] = [headerRow];

    // Sáng 4 tiết
    for (let p = 1; p <= 4; p++) {
      const dayCells = days.map((day) => {
        const slot = schedule.find((s) => s.day === day && s.session === "Sáng" && s.period === p);
        let matchText = "—";
        if (slot) {
          for (const [cls, cell] of Object.entries(slot.assignments)) {
            if (
              cell.teacher === specName ||
              cell.teacher.includes(specName.replace("Cô ", "").replace("Thầy ", "")) ||
              (specSubject && cell.subject.includes(specSubject))
            ) {
              matchText = `Lớp ${cls}\n(${cell.subject})`;
              break;
            }
          }
        }

        return new TableCell({
          width: { size: 16, type: WidthType.PERCENTAGE },
          shading: matchText !== "—" ? { fill: "f1f5f9" } : undefined,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: matchText,
                  size: fontHalfPoints - 2,
                  font: fontFamily,
                  bold: matchText !== "—",
                }),
              ],
            }),
          ],
        });
      });

      rows.push(
        new TableRow({
          children: [
            p === 1
              ? new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.RESTART,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Buổi thứ nhất\n(Sáng)",
                          bold: true,
                          size: fontHalfPoints - 2,
                          font: fontFamily,
                        }),
                      ],
                    }),
                  ],
                })
              : new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.CONTINUE,
                  children: [],
                }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${p}`,
                      bold: true,
                      size: fontHalfPoints - 2,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            ...dayCells,
          ],
        })
      );
    }

    // Chiều 3 tiết
    for (let p = 1; p <= 3; p++) {
      const dayCells = days.map((day) => {
        const slot = schedule.find((s) => s.day === day && s.session === "Chiều" && s.period === p);
        let matchText = "—";
        if (slot) {
          for (const [cls, cell] of Object.entries(slot.assignments)) {
            if (
              cell.teacher === specName ||
              cell.teacher.includes(specName.replace("Cô ", "").replace("Thầy ", "")) ||
              (specSubject && cell.subject.includes(specSubject))
            ) {
              matchText = `Lớp ${cls}\n(${cell.subject})`;
              break;
            }
          }
        }

        return new TableCell({
          width: { size: 16, type: WidthType.PERCENTAGE },
          shading: matchText !== "—" ? { fill: "f1f5f9" } : undefined,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: matchText,
                  size: fontHalfPoints - 2,
                  font: fontFamily,
                  bold: matchText !== "—",
                }),
              ],
            }),
          ],
        });
      });

      rows.push(
        new TableRow({
          children: [
            p === 1
              ? new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.RESTART,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Buổi thứ hai\n(Chiều)",
                          bold: true,
                          size: fontHalfPoints - 2,
                          font: fontFamily,
                        }),
                      ],
                    }),
                  ],
                })
              : new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  verticalMerge: VerticalMergeType.CONTINUE,
                  children: [],
                }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${p}`,
                      bold: true,
                      size: fontHalfPoints - 2,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            ...dayCells,
          ],
        })
      );
    }

    table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: tableBorder,
        bottom: tableBorder,
        left: tableBorder,
        right: tableBorder,
        insideHorizontal: tableBorder,
        insideVertical: tableBorder,
      },
      rows,
    });
  } else {
    // School full matrix
    title = "THỜI KHÓA BIỂU TOÀN TRƯỜNG";
    subTitle = `${profile.schoolName} - Năm học: ${profile.schoolYear} | Áp dụng từ Tuần ${profile.currentWeek}`;
    filePrefix = `TKB_Toan_Truong_${profile.schoolYear.replace(/\s+/g, "")}`;

    const headerCells = [
      createCell("Thứ / Buổi", { width: 12, isHeader: true, fontHalfPoints, fontFamily }),
      createCell("Tiết", { width: 6, isHeader: true, fontHalfPoints, fontFamily }),
      ...classList.map((c) =>
        createCell(`Lớp ${c}`, {
          width: Math.floor(82 / classList.length),
          isHeader: true,
          fontHalfPoints,
          fontFamily,
        })
      ),
    ];

    const rows: TableRow[] = [new TableRow({ tableHeader: true, children: headerCells })];

    for (const slot of schedule) {
      const classCells = classList.map((c) => {
        const assignment = slot.assignments[c];
        const text = assignment ? `${assignment.subject}${assignment.teacher ? ` (${assignment.teacher})` : ""}` : "—";
        return new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text,
                  size: fontHalfPoints - 3,
                  font: fontFamily,
                  bold: !!assignment?.isSpecialist,
                }),
              ],
            }),
          ],
        });
      });

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${slot.day} (${slot.session})`,
                      size: fontHalfPoints - 3,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${slot.period}`,
                      size: fontHalfPoints - 2,
                      font: fontFamily,
                    }),
                  ],
                }),
              ],
            }),
            ...classCells,
          ],
        })
      );
    }

    table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: tableBorder,
        bottom: tableBorder,
        left: tableBorder,
        right: tableBorder,
        insideHorizontal: tableBorder,
        insideVertical: tableBorder,
      },
      rows,
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: fontHalfPoints + 2,
                font: fontFamily,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 140 },
            children: [
              new TextRun({
                text: subTitle,
                italics: true,
                size: fontHalfPoints - 1,
                font: fontFamily,
              }),
            ],
          }),
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filePrefix}.docx`);
}

function createCell(
  text: string,
  options: { width: number; isHeader?: boolean; fontHalfPoints: number; fontFamily: string }
) {
  return new TableCell({
    width: { size: options.width, type: WidthType.PERCENTAGE },
    shading: options.isHeader ? { fill: "f1f5f9" } : undefined,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: options.isHeader,
            size: options.fontHalfPoints - (options.isHeader ? 1 : 2),
            font: options.fontFamily,
          }),
        ],
      }),
    ],
  });
}
