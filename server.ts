import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API to generate or refine KHBD lesson plan using Gemini
app.post("/api/gemini/generate-khbd", async (req, res) => {
  try {
    const { grade, subject, lessonTitle, period, week, integrations, specialRequirements } = req.body;
    const ai = getGenAI();

    const prompt = `Bạn là chuyên gia sư phạm tiểu học Việt Nam xuất sắc, am hiểu tường tận Công văn 2345/BGDĐT-GDTH, chương trình GDPT 2018, Thông tư 08/2024/TT-BGDĐT về lồng ghép QPAN, Công văn 3456/BGDĐT-GDPT về phát triển năng lực số (NLS), tích hợp AI, Giáo dục Dinh dưỡng, Quyền con người (QCN), Giáo dục Môi trường (BVMT), Giáo dục Kỹ năng sống (KNS), STEM, Học thông qua chơi (HTQC).

Hãy soạn KẾ HOẠCH BÀI DẠY (Giáo án) chi tiết, chuẩn mực, chất lượng cao theo mẫu Công văn 2345/BGDĐT cho:
- Khối lớp: Khối ${grade || 2}
- Môn học: ${subject || "Toán"}
- Tên bài dạy / Bài học: ${lessonTitle || "Bài học mới"}
- Tiết PPCT / Thời lượng: ${period || "Tiết 1"}
- Tuần học: Tuần ${week || 1}
- Yêu cầu tích hợp bắt buộc cần lồng ghép khéo léo vào hoạt động: ${integrations ? JSON.stringify(integrations) : "Tích hợp NLS, AI, QCN, QPAN, BVMT phù hợp"}
${specialRequirements ? `- Yêu cầu đặc biệt: ${specialRequirements}` : ""}

Cấu trúc yêu cầu trả về theo đúng định dạng JSON:
{
  "subject": "${subject}",
  "topic": "Tên chủ đề/chủ điểm",
  "lessonTitle": "${lessonTitle}",
  "period": "${period}",
  "week": ${week || 1},
  "objectives": {
    "specificCompetencies": ["- Ghi rõ năng lực đặc thù 1...", "- Năng lực đặc thù 2..."],
    "generalCompetencies": ["- Năng lực tự chủ, tự học: ...", "- Năng lực giao tiếp và hợp tác: ...", "- Năng lực giải quyết vấn đề và sáng tạo: ..."],
    "qualities": ["- Phẩm chất nhân ái: ...", "- Phẩm chất chăm chỉ: ...", "- Phẩm chất trách nhiệm: ...", "- Phẩm chất trung thực / yêu nước: ..."]
  },
  "integratedContent": "Nội dung tích hợp nổi bật (Ví dụ: Tích hợp AI (YCCĐ...): ..., Tích hợp NLS ...: ..., Tích hợp QPAN/QCN/BVMT/GDDD: ...)",
  "equipment": {
    "teacher": "- Giáo viên: SGK, bài giảng điện tử, thiết bị/học liệu, bảng phụ...",
    "students": "- Học sinh: SGK, vở ghi, bảng con, bút chì, đồ dùng thực hành..."
  },
  "activities": [
    {
      "step": 1,
      "title": "1. Khởi động",
      "objective": "Mục tiêu cụ thể của hoạt động khởi động...",
      "time": "5 - 7 phút",
      "teacherActivity": "- GV tổ chức trò chơi/hoạt động... (chi tiết từng bước lời nói, hướng dẫn)\\n- GV chốt ý, dẫn dắt vào bài mới.",
      "studentActivity": "- HS tham gia nhiệt tình...\\n- HS lắng nghe và ghi tên bài vào vở."
    },
    {
      "step": 2,
      "title": "2. Khám phá",
      "objective": "Mục tiêu cụ thể của hoạt động khám phá kiến thức...",
      "time": "10 - 15 phút",
      "teacherActivity": "- GV hướng dẫn quan sát, thảo luận... (lồng ghép nội dung tích hợp nếu có)\\n- GV chốt kiến thức trọng tâm.",
      "studentActivity": "- HS quan sát, trao đổi nhóm đôi/nhóm 4...\\n- Đại diện trả lời, rút ra nhận xét."
    },
    {
      "step": 3,
      "title": "3. Luyện tập / Thực hành",
      "objective": "Mục tiêu rèn luyện kĩ năng, làm bài tập...",
      "time": "12 - 15 phút",
      "teacherActivity": "- GV giao nhiệm vụ bài tập 1, 2...\\n- Hướng dẫn hỗ trợ học sinh còn lúng túng\\n- Nhận xét tuyên dương.",
      "studentActivity": "- HS làm bài cá nhân/nhóm vào vở/bảng con...\\n- Đổi vở soát chéo, nhận xét lẫn nhau."
    },
    {
      "step": 4,
      "title": "4. Vận dụng / Trải nghiệm",
      "objective": "Mục tiêu vận dụng thực tế đời sống, liên hệ bản thân...",
      "time": "5 - 7 phút",
      "teacherActivity": "- GV nêu tình huống thực tế/trò chơi vận dụng liên hệ cuộc sống...\\n- Dặn dò chuẩn bị bài sau.",
      "studentActivity": "- HS liên hệ bản thân và thực hành xử lý tình huống...\\n- Lắng nghe ghi nhớ nhiệm vụ."
    }
  ],
  "adjustment": "........................................................................................................................"
}

Chỉ trả về định dạng JSON hợp lệ, không bọc markdown hoặc text thừa ngoài JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Gemini KHBD error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate KHBD" });
  }
});

// API to suggest integrations
app.post("/api/gemini/suggest-integration", async (req, res) => {
  try {
    const { grade, subject, lessonTitle } = req.body;
    const ai = getGenAI();

    const prompt = `Gợi ý các nội dung tích hợp phù hợp nhất cho bài học:
- Khối lớp: Khối ${grade}
- Môn: ${subject}
- Tên bài: ${lessonTitle}

Hãy đề xuất các phương án tích hợp:
1. Năng lực số (NLS) theo CV 3456/BGDĐT (kèm mã YCCĐ như NLS 1.1.CB1a, 5.2.CB1a...)
2. Trí tuệ nhân tạo (AI) theo khung giáo dục tiểu học (mã YCCĐ 1.A1.1, 2.A1.2, 2.A2.1, 4.A1.1, 4.C2.1...)
3. Quyền con người (QCN) / Quyền trẻ em
4. Giáo dục Quốc phòng - An ninh (QPAN / GDQPAN) theo TT 08/2024
5. Giáo dục Dinh dưỡng (GDDD) / Bảo vệ môi trường (BVMT)
6. Kĩ năng sống (KNS) / An toàn giao thông (ATGT) / STEM / Học thông qua chơi (HTQC)

Trả về JSON có cấu trúc:
{
  "suggestions": [
    {
      "type": "NLS",
      "label": "Tích hợp Năng lực số",
      "code": "NLS 1.1.CB1a",
      "content": "Nội dung tích hợp chi tiết...",
      "activitySuggestion": "Gợi ý hoạt động lồng ghép..."
    },
    {
      "type": "AI",
      "label": "Tích hợp Trí tuệ nhân tạo (AI)",
      "code": "AI YCCĐ 2.A1.1",
      "content": "Nội dung tích hợp chi tiết...",
      "activitySuggestion": "Gợi ý hoạt động lồng ghép..."
    },
    {
      "type": "QCN",
      "label": "Tích hợp Quyền con người",
      "code": "QCN",
      "content": "Nội dung tích hợp...",
      "activitySuggestion": "Gợi ý hoạt động..."
    },
    {
      "type": "QPAN",
      "label": "Tích hợp GD Quốc phòng - An ninh",
      "code": "GDQPAN",
      "content": "Nội dung tích hợp...",
      "activitySuggestion": "Gợi ý hoạt động..."
    },
    {
      "type": "BVMT",
      "label": "Tích hợp Bảo vệ môi trường / Dinh dưỡng",
      "code": "BVMT/GDDD",
      "content": "Nội dung tích hợp...",
      "activitySuggestion": "Gợi ý hoạt động..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Integration suggestion error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to suggest integration" });
  }
});

// API to parse raw timetable pasted by teacher
app.post("/api/gemini/parse-tkb", async (req, res) => {
  try {
    const { rawText } = req.body;
    const ai = getGenAI();

    const prompt = `Phân tích đoạn văn bản thời khóa biểu trường tiểu học sau đây thành cấu trúc dữ liệu JSON chuẩn:
"${rawText}"

Trả về JSON:
{
  "classes": ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"],
  "teachers": [
    { "name": "Nguyễn Hoàng Tuấn", "shortName": "Tuấn", "role": "GVCN 5A", "subject": "Chủ nhiệm" },
    { "name": "Cao Thị Khánh Linh", "shortName": "Linh", "role": "GVCN 2A", "subject": "Chủ nhiệm" },
    { "name": "Cô Nương", "shortName": "Nương", "role": "GV Chuyên", "subject": "Tiếng Anh" },
    { "name": "Cô Thy", "shortName": "Thy", "role": "GV Chuyên", "subject": "Mĩ thuật" },
    { "name": "Cô Tuệ", "shortName": "Tuệ", "role": "GV Chuyên", "subject": "Âm nhạc" },
    { "name": "Cô Nhàn", "shortName": "Nhàn", "role": "GV Chuyên", "subject": "GDTC" },
    { "name": "Cô Phương", "shortName": "Phương", "role": "GV Chuyên", "subject": "Tin học/HĐTT" }
  ],
  "schedule": [
    {
      "dayOfWeek": "Thứ Hai",
      "session": "Sáng",
      "period": 1,
      "assignments": {
        "1A": { "subject": "HĐTN (CC)", "teacher": "Chi" },
        "2A": { "subject": "HĐTN (CC)", "teacher": "Linh" },
        "5A": { "subject": "HĐTN (CC)", "teacher": "Tuấn" }
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Parse TKB error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to parse TKB" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
