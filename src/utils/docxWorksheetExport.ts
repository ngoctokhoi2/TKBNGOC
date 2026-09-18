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
  PageBreak,
} from "docx";
import saveAs from "file-saver";
import { SchoolProfile, WeeklyWorksheet } from "../types";

/**
 * Export a single weekly worksheet to Word (.docx)
 */
export async function exportSingleWorksheetDocx(
  profile: SchoolProfile,
  worksheet: WeeklyWorksheet,
  fontSize: 12 | 13 | 14 = 13
) {
  const fontHalfPoints = fontSize * 2;
  const fontFamily = "Times New Roman";
  const borderThin = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borderNone = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  const sectionsChildren: any[] = [];

  // 1. Ministry & School Header (2-column layout)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderNone,
      bottom: borderNone,
      left: borderNone,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (profile.districtDepartment || "PHÒNG GD&ĐT HUYỆN TÂN THẠNH").toUpperCase(),
                    font: fontFamily,
                    size: fontHalfPoints - 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (profile.schoolName || "TRƯỜNG TIỂU HỌC TÂN THẠNH").toUpperCase(),
                    bold: true,
                    font: fontFamily,
                    size: fontHalfPoints - 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "-------------------",
                    font: fontFamily,
                    size: fontHalfPoints - 4,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                    bold: true,
                    font: fontFamily,
                    size: fontHalfPoints - 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Độc lập - Tự do - Hạnh phúc",
                    bold: true,
                    font: fontFamily,
                    size: fontHalfPoints - 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "-----------------------",
                    font: fontFamily,
                    size: fontHalfPoints - 4,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  sectionsChildren.push(headerTable);

  // Spacing
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 180, after: 120 },
      children: [],
    })
  );

  // Title
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `PHIẾU BÀI TẬP CUỐI TUẦN ${worksheet.week}`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints + 4,
          color: "002060",
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Môn: ${worksheet.subject.toUpperCase()} - KHỐI ${worksheet.grade} (${worksheet.bookSeries || "Bộ sách GDPT 2018"})`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints,
          italics: true,
        }),
      ],
    })
  );

  // Student Info Box
  const studentBoxTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderThin,
      bottom: borderThin,
      left: borderThin,
      right: borderThin,
      insideHorizontal: borderThin,
      insideVertical: borderThin,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 80, after: 60 },
                children: [
                  new TextRun({
                    text: "Họ và tên học sinh: ..........................................................................",
                    font: fontFamily,
                    size: fontHalfPoints,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: `Lớp: ${profile.className || worksheet.grade + "A"}       - Trường: ${profile.schoolName || "Tiểu học"}`,
                    font: fontFamily,
                    size: fontHalfPoints,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: "ĐIỂM SỐ / NHẬN XÉT",
                    bold: true,
                    font: fontFamily,
                    size: fontHalfPoints - 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [
                  new TextRun({
                    text: ".................................",
                    font: fontFamily,
                    size: fontHalfPoints,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  sectionsChildren.push(studentBoxTable);

  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: "I. PHẦN TRẮC NGHIỆM (Khoanh tròn vào chữ cái A, B, C hoặc D trước câu trả lời đúng):",
          bold: true,
          font: fontFamily,
          size: fontHalfPoints,
        }),
      ],
    })
  );

  // Questions
  worksheet.questions.forEach((q) => {
    // Question Prompt
    sectionsChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [
          new TextRun({
            text: `Câu ${q.questionNumber}: `,
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          }),
          new TextRun({
            text: q.questionText,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );

    // Options (A, B, C, D)
    const optionRuns: TextRun[] = [];
    q.options.forEach((opt, idx) => {
      optionRuns.push(
        new TextRun({
          text: `${opt.key}. `,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints,
        })
      );
      optionRuns.push(
        new TextRun({
          text: `${opt.text}${idx < q.options.length - 1 ? "          " : ""}`,
          font: fontFamily,
          size: fontHalfPoints,
        })
      );
    });

    sectionsChildren.push(
      new Paragraph({
        indent: { left: 400 },
        spacing: { after: 80 },
        children: optionRuns,
      })
    );
  });

  // Section II: Essay / Practice
  if (worksheet.essayExercises && worksheet.essayExercises.length > 0) {
    sectionsChildren.push(
      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "II. PHẦN TỰ LUẬN / THỰC HÀNH:",
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );

    worksheet.essayExercises.forEach((e) => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({
              text: `Bài ${e.exerciseNumber} (${e.title}): `,
              bold: true,
              font: fontFamily,
              size: fontHalfPoints,
            }),
            new TextRun({
              text: e.prompt,
              font: fontFamily,
              size: fontHalfPoints,
            }),
          ],
        })
      );

      // Add dashed writing lines for students
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: "Bài làm:",
              italics: true,
              font: fontFamily,
              size: fontHalfPoints - 2,
            }),
          ],
        })
      );
      for (let i = 0; i < 4; i++) {
        sectionsChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "........................................................................................................................................................................",
                font: fontFamily,
                size: fontHalfPoints,
                color: "888888",
              }),
            ],
          })
        );
      }
    });
  }

  // Page break for Solution / Answer Key
  sectionsChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // Solution Section
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: `ĐÁP ÁN & LỜI GIẢI CHI TIẾT - TUẦN ${worksheet.week}`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints + 2,
          color: "008000",
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `(Nguồn đề tham khảo & giải chi tiết: https://loigiaihay.com/ - Môn ${worksheet.subject})`,
          italics: true,
          font: fontFamily,
          size: fontHalfPoints - 2,
          color: "555555",
        }),
      ],
    })
  );

  // Answer Key Table
  const tableHeaderRow = new TableRow({
    children: worksheet.questions.map((q) => {
      return new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Câu ${q.questionNumber}`,
                bold: true,
                font: fontFamily,
                size: fontHalfPoints - 2,
              }),
            ],
          }),
        ],
      });
    }),
  });

  const tableAnswerRow = new TableRow({
    children: worksheet.questions.map((q) => {
      return new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: q.correctAnswer,
                bold: true,
                font: fontFamily,
                size: fontHalfPoints,
                color: "D00000",
              }),
            ],
          }),
        ],
      });
    }),
  });

  const answerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderThin,
      bottom: borderThin,
      left: borderThin,
      right: borderThin,
      insideHorizontal: borderThin,
      insideVertical: borderThin,
    },
    rows: [tableHeaderRow, tableAnswerRow],
  });

  sectionsChildren.push(answerTable);

  // Detailed explanations
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "HƯỚNG DẪN GIẢI CHI TIẾT TỪNG CÂU:",
          bold: true,
          font: fontFamily,
          size: fontHalfPoints,
        }),
      ],
    })
  );

  worksheet.questions.forEach((q) => {
    sectionsChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: `Câu ${q.questionNumber} (Chọn ${q.correctAnswer}): `,
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          }),
          new TextRun({
            text: q.explanation,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );
  });

  if (worksheet.essayExercises && worksheet.essayExercises.length > 0) {
    sectionsChildren.push(
      new Paragraph({
        spacing: { before: 180, after: 100 },
        children: [
          new TextRun({
            text: "HƯỚNG DẪN GIẢI PHẦN TỰ LUẬN:",
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );

    worksheet.essayExercises.forEach((e) => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `Bài ${e.exerciseNumber} (${e.title}): `,
              bold: true,
              font: fontFamily,
              size: fontHalfPoints,
            }),
          ],
        })
      );
      sectionsChildren.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: e.solution,
              font: fontFamily,
              size: fontHalfPoints,
            }),
          ],
        })
      );
    });
  }

  // Create Docx Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2 cm
              bottom: 1134,
              left: 1417, // 2.5 cm
              right: 1134, // 2 cm
            },
          },
        },
        children: sectionsChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanSubject = worksheet.subject.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
  const fileName = `Phieu_Cuoi_Tuan_${worksheet.week}_${cleanSubject}_Lop_${worksheet.grade}.docx`;
  saveAs(blob, fileName);
}

/**
 * Export all weekly worksheets in a complete single Word (.docx) bundle
 */
export async function exportWeeklyBundleDocx(
  profile: SchoolProfile,
  worksheets: WeeklyWorksheet[],
  week: number,
  grade: number,
  fontSize: 12 | 13 | 14 = 13
) {
  const fontHalfPoints = fontSize * 2;
  const fontFamily = "Times New Roman";
  const borderThin = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borderNone = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  const sectionsChildren: any[] = [];

  // Bundle Cover Page
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 120 },
      children: [
        new TextRun({
          text: (profile.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(),
          bold: true,
          font: fontFamily,
          size: fontHalfPoints + 2,
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `TỔ CHUYÊN MÔN KHỐI ${grade}`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints,
          color: "555555",
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 180 },
      children: [
        new TextRun({
          text: `TRỌN BỘ PHIẾU BÀI TẬP CUỐI TUẦN ${week}`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints + 8,
          color: "002060",
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `DÀNH CHO HỌC SINH KHỐI ${grade} - NĂM HỌC ${profile.schoolYear || "2025 - 2026"}`,
          bold: true,
          font: fontFamily,
          size: fontHalfPoints + 2,
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: `Gồm các môn: ${worksheets.map((w) => w.subject).join(" • ")}`,
          italics: true,
          font: fontFamily,
          size: fontHalfPoints,
          color: "008000",
        }),
      ],
    })
  );

  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "Nguồn tổng hợp & đáp án tham khảo: https://loigiaihay.com/",
          font: fontFamily,
          size: fontHalfPoints - 2,
          color: "888888",
        }),
      ],
    })
  );

  // Loop through all worksheets and append them with page breaks
  worksheets.forEach((ws) => {
    sectionsChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // Title
    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: `PHIẾU BÀI TẬP CUỐI TUẦN ${ws.week} - MÔN ${ws.subject.toUpperCase()}`,
            bold: true,
            font: fontFamily,
            size: fontHalfPoints + 2,
            color: "002060",
          }),
        ],
      })
    );

    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: `Họ và tên: .............................................................. Lớp: ${profile.className || grade + "A"}`,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );

    // Questions
    sectionsChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [
          new TextRun({
            text: "Phần I. Trắc nghiệm (Khoanh tròn vào đáp án đúng nhất):",
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          }),
        ],
      })
    );

    ws.questions.forEach((q) => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({
              text: `Câu ${q.questionNumber}: `,
              bold: true,
              font: fontFamily,
              size: fontHalfPoints,
            }),
            new TextRun({
              text: q.questionText,
              font: fontFamily,
              size: fontHalfPoints,
            }),
          ],
        })
      );

      const optionRuns: TextRun[] = [];
      q.options.forEach((opt, idx) => {
        optionRuns.push(
          new TextRun({
            text: `${opt.key}. `,
            bold: true,
            font: fontFamily,
            size: fontHalfPoints,
          })
        );
        optionRuns.push(
          new TextRun({
            text: `${opt.text}${idx < q.options.length - 1 ? "       " : ""}`,
            font: fontFamily,
            size: fontHalfPoints,
          })
        );
      });

      sectionsChildren.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 60 },
          children: optionRuns,
        })
      );
    });

    // Essay exercises
    if (ws.essayExercises && ws.essayExercises.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: "Phần II. Tự luận & Thực hành:",
              bold: true,
              font: fontFamily,
              size: fontHalfPoints,
            }),
          ],
        })
      );

      ws.essayExercises.forEach((e) => {
        sectionsChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: `Bài ${e.exerciseNumber} (${e.title}): `,
                bold: true,
                font: fontFamily,
                size: fontHalfPoints,
              }),
              new TextRun({
                text: e.prompt,
                font: fontFamily,
                size: fontHalfPoints,
              }),
            ],
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              bottom: 1134,
              left: 1417,
              right: 1134,
            },
          },
        },
        children: sectionsChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Tron_Bo_Phieu_Cuoi_Tuan_${week}_Khoi_${grade}.docx`;
  saveAs(blob, fileName);
}
