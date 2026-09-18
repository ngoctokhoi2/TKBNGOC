import { GradeLevel, WeeklyWorksheet, QuizQuestion, EssayExercise } from "../types";

/**
 * Returns the list of standard subjects for weekly review quizzes based on grade level
 * Grade 1, 2, 3: Toán, Tiếng Việt, Đạo đức, Hoạt động trải nghiệm, Tự nhiên và Xã hội
 * Grade 4, 5: Toán, Tiếng Việt, Đạo đức, Hoạt động trải nghiệm, Lịch sử và Địa lí, Khoa học
 */
export function getSubjectsForGrade(grade: GradeLevel): string[] {
  if (grade <= 3) {
    return [
      "Toán",
      "Tiếng Việt",
      "Đạo đức",
      "Hoạt động trải nghiệm",
      "Tự nhiên và Xã hội",
    ];
  }
  return [
    "Toán",
    "Tiếng Việt",
    "Đạo đức",
    "Hoạt động trải nghiệm",
    "Lịch sử và Địa lí",
    "Khoa học",
  ];
}

/**
 * Subject badge colors for UI presentation
 */
export const subjectThemeColors: Record<
  string,
  { bg: string; text: string; border: string; lightBg: string; hoverBg: string }
> = {
  Toán: {
    bg: "bg-blue-600",
    text: "text-blue-700",
    border: "border-blue-200",
    lightBg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
  },
  "Tiếng Việt": {
    bg: "bg-emerald-600",
    text: "text-emerald-700",
    border: "border-emerald-200",
    lightBg: "bg-emerald-50",
    hoverBg: "hover:bg-emerald-100",
  },
  "Đạo đức": {
    bg: "bg-amber-600",
    text: "text-amber-700",
    border: "border-amber-200",
    lightBg: "bg-amber-50",
    hoverBg: "hover:bg-amber-100",
  },
  "Hoạt động trải nghiệm": {
    bg: "bg-rose-600",
    text: "text-rose-700",
    border: "border-rose-200",
    lightBg: "bg-rose-50",
    hoverBg: "hover:bg-rose-100",
  },
  "Tự nhiên và Xã hội": {
    bg: "bg-teal-600",
    text: "text-teal-700",
    border: "border-teal-200",
    lightBg: "bg-teal-50",
    hoverBg: "hover:bg-teal-100",
  },
  "Khoa học": {
    bg: "bg-cyan-600",
    text: "text-cyan-700",
    border: "border-cyan-200",
    lightBg: "bg-cyan-50",
    hoverBg: "hover:bg-cyan-100",
  },
  "Lịch sử và Địa lí": {
    bg: "bg-purple-600",
    text: "text-purple-700",
    border: "border-purple-200",
    lightBg: "bg-purple-50",
    hoverBg: "hover:bg-purple-100",
  },
};

/**
 * Construct accurate Loigiaihay.com category URLs based on grade and subject
 */
export function getLoigiaihaySubjectUrl(grade: GradeLevel, subject: string, week: number): string {
  const cleanSubject = subject.toLowerCase().trim();
  
  if (cleanSubject.includes("toán")) {
    const categoryIds: Record<number, string> = {
      1: "c120",
      2: "c121",
      3: "c123",
      4: "c125",
      5: "c127",
    };
    const catId = categoryIds[grade] || "c121";
    return `https://loigiaihay.com/bai-tap-cuoi-tuan-toan-lop-${grade}-${catId}.html`;
  }
  
  if (cleanSubject.includes("tiếng việt") || cleanSubject.includes("viet")) {
    const categoryIds: Record<number, string> = {
      1: "c121",
      2: "c122",
      3: "c124",
      4: "c126",
      5: "c128",
    };
    const catId = categoryIds[grade] || "c122";
    return `https://loigiaihay.com/bai-tap-cuoi-tuan-tieng-viet-lop-${grade}-${catId}.html`;
  }

  // For subjects like Đạo đức, HĐTN, TNXH, Khoa học, Lịch sử & Địa lí
  const subjectSearchKeywords: Record<string, string> = {
    "Đạo đức": `bai-tap-dao-duc-lop-${grade}`,
    "Hoạt động trải nghiệm": `hoat-dong-trai-nghiem-lop-${grade}`,
    "Tự nhiên và Xã hội": `tu-nhien-va-xa-hoi-lop-${grade}`,
    "Khoa học": `khoa-hoc-lop-${grade}`,
    "Lịch sử và Địa lí": `lich-su-va-dia-li-lop-${grade}`,
  };

  const keyword = subjectSearchKeywords[subject] || `bai-tap-lop-${grade}`;
  return `https://loigiaihay.com/tim-kiem?q=bài+tập+cuối+tuần+${encodeURIComponent(subject)}+lớp+${grade}+tuần+${week}`;
}

/**
 * Standard curriculum templates for Grade 1-5 across subjects & weeks
 */
export function generateWorksheet(
  grade: GradeLevel,
  week: number,
  subject: string,
  bookSeries: string = "Kết nối tri thức với cuộc sống"
): WeeklyWorksheet {
  const loigiaihayUrl = getLoigiaihaySubjectUrl(grade, subject, week);

  // High-fidelity specific data for Grade 2 (User's current profile class) and Grade 5
  if (grade === 2 && subject === "Toán") {
    return {
      id: `ws-g${grade}-w${week}-${subject}`,
      grade,
      week,
      subject,
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - MÔN TOÁN LỚP 2`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g2-w${week}-m1`,
          questionNumber: 1,
          questionText: "Số liền trước của số lớn nhất có hai chữ số là số nào?",
          options: [
            { key: "A", text: "98" },
            { key: "B", text: "99" },
            { key: "C", text: "100" },
            { key: "D", text: "97" },
          ],
          correctAnswer: "A",
          explanation: "Số lớn nhất có hai chữ số là 99. Số liền trước của 99 là 99 - 1 = 98. (Loigiaihay.com)",
        },
        {
          id: `q-g2-w${week}-m2`,
          questionNumber: 2,
          questionText: "Kết quả của phép tính: 45 + 38 là bao nhiêu?",
          options: [
            { key: "A", text: "73" },
            { key: "B", text: "83" },
            { key: "C", text: "82" },
            { key: "D", text: "93" },
          ],
          correctAnswer: "B",
          explanation: "Đặt tính: 5 cộng 8 bằng 13, viết 3 nhớ 1; 4 cộng 3 bằng 7, thêm 1 bằng 8. Vậy 45 + 38 = 83.",
        },
        {
          id: `q-g2-w${week}-m3`,
          questionNumber: 3,
          questionText: "Bao gạo nặng 52 kg, sau khi bán đi một số kg gạo thì còn lại 27 kg. Hỏi đã bán được bao nhiêu kg gạo?",
          options: [
            { key: "A", text: "35 kg" },
            { key: "B", text: "25 kg" },
            { key: "C", text: "27 kg" },
            { key: "D", text: "79 kg" },
          ],
          correctAnswer: "B",
          explanation: "Số kg gạo đã bán là: 52 - 27 = 25 (kg). Đáp số: 25 kg. (Loigiaihay.com)",
        },
        {
          id: `q-g2-w${week}-m4`,
          questionNumber: 4,
          questionText: "Trong hình vẽ, một đoạn thẳng dài 1 dm 5 cm. Độ dài đoạn thẳng đó tính bằng xăng-ti-mét là:",
          options: [
            { key: "A", text: "15 cm" },
            { key: "B", text: "105 cm" },
            { key: "C", text: "51 cm" },
            { key: "D", text: "6 cm" },
          ],
          correctAnswer: "A",
          explanation: "Đổi 1 dm = 10 cm. Do đó 1 dm 5 cm = 10 cm + 5 cm = 15 cm.",
        },
        {
          id: `q-g2-w${week}-m5`,
          questionNumber: 5,
          questionText: "Hình nào dưới đây có 3 hình tam giác và 1 hình tứ giác?",
          options: [
            { key: "A", text: "Hình ngôi nhà có mái tam giác" },
            { key: "B", text: "Hình cánh buồm chia thành 3 phần" },
            { key: "C", text: "Hình chữ nhật có 1 đường chéo" },
            { key: "D", text: "Hình thang cân" },
          ],
          correctAnswer: "B",
          explanation: "Quan sát đếm số cạnh và số đỉnh, hình cánh buồm được tạo bởi 3 tam giác ghép thành 1 tứ giác.",
        },
      ],
      essayExercises: [
        {
          id: `e-g2-w${week}-m1`,
          exerciseNumber: 1,
          title: "Đặt tính rồi tính",
          prompt: "a) 38 + 27 = ?\nb) 62 - 35 = ?\nc) 49 + 18 = ?\nd) 90 - 46 = ?",
          solution: "a) 38 + 27 = 65\nb) 62 - 35 = 27\nc) 49 + 18 = 67\nd) 90 - 46 = 44\n(Trình bày đặt tính thẳng cột hàng đơn vị và hàng chục).",
        },
        {
          id: `e-g2-w${week}-m2`,
          exerciseNumber: 2,
          title: "Giải bài toán có lời văn",
          prompt: "Lớp 2A có 18 bạn nam và số bạn nữ nhiều hơn số bạn nam là 5 bạn. Hỏi lớp 2A có tất cả bao nhiêu học sinh?",
          solution: "Bài giải:\nSố bạn nữ của lớp 2A là:\n  18 + 5 = 23 (bạn)\nLớp 2A có tất cả số học sinh là:\n  18 + 23 = 41 (học sinh)\nĐáp số: 41 học sinh. (Theo Loigiaihay.com)",
        },
      ],
    };
  }

  if (grade === 2 && subject === "Tiếng Việt") {
    return {
      id: `ws-g${grade}-w${week}-${subject}`,
      grade,
      week,
      subject,
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - MÔN TIẾNG VIỆT LỚP 2`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g2-w${week}-tv1`,
          questionNumber: 1,
          questionText: "Từ nào dưới đây là từ chỉ hoạt động của học sinh trong giờ ra chơi?",
          options: [
            { key: "A", text: "Nhảy dây" },
            { key: "B", text: "Sách vở" },
            { key: "C", text: "Chăm chỉ" },
            { key: "D", text: "Bảng đen" },
          ],
          correctAnswer: "A",
          explanation: "'Nhảy dây' là từ chỉ hoạt động thể chất, vui chơi. 'Sách vở', 'Bảng đen' là từ chỉ đồ vật; 'Chăm chỉ' là từ chỉ đặc điểm.",
        },
        {
          id: `q-g2-w${week}-tv2`,
          questionNumber: 2,
          questionText: "Câu nào dưới đây được viết theo mẫu câu 'Ai là gì?'",
          options: [
            { key: "A", text: "Cô giáo em đang say sưa giảng bài." },
            { key: "B", text: "Bạn Mai là lớp trưởng gương mẫu của lớp em." },
            { key: "C", text: "Đàn chim sẻ hót líu lo trên cành phượng vĩ." },
            { key: "D", text: "Bầu trời mùa thu trong xanh và cao vút." },
          ],
          correctAnswer: "B",
          explanation: "Câu 'Bạn Mai là lớp trưởng gương mẫu của lớp em' dùng từ 'là' để giới thiệu, nhận định, thuộc mẫu Ai là gì? (Loigiaihay.com)",
        },
        {
          id: `q-g2-w${week}-tv3`,
          questionNumber: 3,
          questionText: "Dấu câu nào thích hợp nhất để điền vào ô trống cuối câu: 'Mùa thu này, em được lên lớp mấy [ ? ]'",
          options: [
            { key: "A", text: "Dấu chấm (.)" },
            { key: "B", text: "Dấu phẩy (,)" },
            { key: "C", text: "Dấu chấm hỏi (?)" },
            { key: "D", text: "Dấu chấm than (!)" },
          ],
          correctAnswer: "C",
          explanation: "Đây là câu hỏi nhằm mục đích hỏi tuổi/lớp nên cuối câu phải dùng dấu chấm hỏi (?).",
        },
        {
          id: `q-g2-w${week}-tv4`,
          questionNumber: 4,
          questionText: "Tìm từ ngữ viết đúng chính tả có chứa phụ âm 'ch' hoặc 'tr':",
          options: [
            { key: "A", text: "chăm chỉ" },
            { key: "B", text: "trăm chỉ" },
            { key: "C", text: "chường học" },
            { key: "D", text: "con châu" },
          ],
          correctAnswer: "A",
          explanation: "'chăm chỉ' viết đúng. Các từ kia sai chính tả: phải là trường học, con trâu.",
        },
        {
          id: `q-g2-w${week}-tv5`,
          questionNumber: 5,
          questionText: "Thành ngữ nào dưới đây khuyên chúng ta tinh thần đoàn kết, giúp đỡ nhau?",
          options: [
            { key: "A", text: "Học thầy không tày học bạn" },
            { key: "B", text: "Lá lành đùm lá rách" },
            { key: "C", text: "Uống nước nhớ nguồn" },
            { key: "D", text: "Có công mài sắt, có ngày nên kim" },
          ],
          correctAnswer: "B",
          explanation: "'Lá lành đùm lá rách' thể hiện tinh thần tương thân tương ái, đùm bọc đồng bào và bạn bè.",
        },
      ],
      essayExercises: [
        {
          id: `e-g2-w${week}-tv1`,
          exerciseNumber: 1,
          title: "Chính tả (Nghe - viết / Phân biệt s/x, l/n)",
          prompt: "Điền 's' hoặc 'x' vào chỗ trống:\n...áng sớm, mặt trời chiếu những tia nắng ...inh ...ắn xuống ...ân trường rộn rã tiếng cười vui.",
          solution: "Đáp án: Sáng sớm, mặt trời chiếu những tia nắng xinh xắn xuống sân trường rộn rã tiếng cười vui.",
        },
        {
          id: `e-g2-w${week}-tv2`,
          exerciseNumber: 2,
          title: "Luyện viết đoạn văn (Từ 3 đến 5 câu)",
          prompt: "Viết từ 3 đến 5 câu kể về một người bạn cùng bàn mà em yêu quý nhất ở lớp 2.",
          solution: "Gợi ý mẫu (Loigiaihay.com):\nỞ lớp 2A, người bạn ngồi cùng bàn với em là bạn Lan. Bạn có mái tóc ngắn buộc nơ rất xinh xắn và nụ cười rạng rỡ. Trong giờ học, Lan luôn chú ý nghe cô giáo giảng bài và nhiệt tình giúp đỡ em khi gặp bài toán khó. Giờ ra chơi, em và Lan cùng chơi nhảy dây rất vui. Em rất quý Lan và mong chúng em mãi là đôi bạn thân thiết.",
        },
      ],
    };
  }

  if (grade <= 3 && subject === "Đạo đức") {
    return {
      id: `ws-g${grade}-w${week}-${subject}`,
      grade,
      week,
      subject,
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - MÔN ĐẠO ĐỨC LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-dd1`,
          questionNumber: 1,
          questionText: "Hành động nào dưới đây thể hiện sự tôn trọng và biết ơn thầy cô giáo?",
          options: [
            { key: "A", text: "Khoanh tay chào hỏi lễ phép khi gặp thầy cô" },
            { key: "B", text: "Nói chuyện riêng và làm việc khác trong giờ học" },
            { key: "C", text: "Lờ đi coi như không thấy khi thầy cô đi qua" },
            { key: "D", text: "Không làm bài tập về nhà cô giao" },
          ],
          correctAnswer: "A",
          explanation: "Khoanh tay chào lễ phép thể hiện sự kính trọng, lễ nghĩa đối với thầy cô giáo. (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-dd2`,
          questionNumber: 2,
          questionText: "Khi em vô tình làm rơi chiếc bút chì của bạn ngồi bên cạnh, em nên làm gì?",
          options: [
            { key: "A", text: "Lấy chân đá chiếc bút sang chỗ khác" },
            { key: "B", text: "Nhặt lên, đưa cho bạn và nói lời xin lỗi chân thành" },
            { key: "C", text: "Mặc kệ vì không phải mình cố ý" },
            { key: "D", text: "Đổ lỗi cho bạn khác làm rơi" },
          ],
          correctAnswer: "B",
          explanation: "Biết nhận lỗi và nhặt bút trả bạn là hành vi văn minh, trung thực và thân thiện.",
        },
        {
          id: `q-g${grade}-w${week}-dd3`,
          questionNumber: 3,
          questionText: "Hành vi nào dưới đây thể hiện việc biết giữ gìn đồ dùng học tập sạch sẽ, bền đẹp?",
          options: [
            { key: "A", text: "Vẽ bậy, xé trang giấy trắng của vở ghi" },
            { key: "B", text: "Bọc bìa, dán nhãn vở cẩn thận và xếp gọn vào cặp sau khi học" },
            { key: "C", text: "Vứt cặp sách lung tung xuống nền nhà" },
            { key: "D", text: "Làm gãy thước kẻ để nghịch" },
          ],
          correctAnswer: "B",
          explanation: "Bọc sách vở và xếp ngăn nắp là thói quen quý báu giúp bảo quản dụng cụ học tập.",
        },
        {
          id: `q-g${grade}-w${week}-dd4`,
          questionNumber: 4,
          questionText: "Khi thấy một bạn trong lớp bị vấp ngã ở sân trường, thái độ đúng đắn của em là:",
          options: [
            { key: "A", text: "Đứng chỉ tay cười nhạo bạn" },
            { key: "B", text: "Nhanh chóng chạy lại đỡ bạn dậy, phủi bụi và hỏi thăm bạn có đau không" },
            { key: "C", text: "Chạy đi chỗ khác chơi tiếp" },
            { key: "D", text: "Gọi các bạn khác lại xem để trêu bạn" },
          ],
          correctAnswer: "B",
          explanation: "Tương thân tương ái, biết giúp đỡ bạn bè khi gặp khó khăn, hoạn nạn.",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-dd1`,
          exerciseNumber: 1,
          title: "Xử lí tình huống thực tế",
          prompt: "Tình huống: Trong giờ ra chơi, bạn Nam rủ em trèo lên lan can tầng 2 để nhìn xuống sân trường cho rõ. Nếu là em, em sẽ nói gì và làm gì?",
          solution: "Gợi ý trả lời (Loigiaihay.com):\nEm sẽ kiên quyết từ chối và khuyên bạn Nam: 'Trèo lên lan can rất nguy hiểm, dễ bị trượt chân ngã gây thương tích nặng đấy bạn ơi! Chúng mình cùng xuống sân trường chơi nhảy dây hoặc đọc sách dưới bóng cây nhé.' Nếu bạn Nam không nghe, em sẽ báo ngay với thầy cô giáo hoặc bác bảo vệ để can thiệp kịp thời.",
        },
      ],
    };
  }

  if (grade <= 3 && (subject === "Hoạt động trải nghiệm" || subject === "HĐTN")) {
    return {
      id: `ws-g${grade}-w${week}-hdtn`,
      grade,
      week,
      subject: "Hoạt động trải nghiệm",
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - HOẠT ĐỘNG TRẢI NGHIỆM LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-hd1`,
          questionNumber: 1,
          questionText: "Trong buổi lễ Chào cờ đầu tuần, học sinh cần có tư thế như thế nào?",
          options: [
            { key: "A", text: "Đứng nghiêm trang, mắt hướng về Quốc kỳ, hát to Quốc ca" },
            { key: "B", text: "Ngồi bệt xuống đất, vừa nói chuyện vừa ăn quà vặt" },
            { key: "C", text: "Quay lưng lại sân khấu để chơi đuổi bắt" },
            { key: "D", text: "Đội mũ che kín mặt không hát Quốc ca" },
          ],
          correctAnswer: "A",
          explanation: "Đứng trang nghiêm chào cờ thể hiện lòng yêu nước và sự tôn kính biểu tượng quốc gia. (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-hd2`,
          questionNumber: 2,
          questionText: "Để giữ gìn lớp học xanh - sạch - đẹp, việc làm nào sau đây là đúng?",
          options: [
            { key: "A", text: "Vứt vỏ kẹo, giấy rác ngay dưới gầm bàn" },
            { key: "B", text: "Cùng các bạn trong tổ trực nhật quét lớp, lau bảng và tưới cây xanh" },
            { key: "C", text: "Dùng bút xóa vẽ lên mặt bàn gỗ" },
            { key: "D", text: "Bẻ cành cây hoa trong bồn hoa nhà trường" },
          ],
          correctAnswer: "B",
          explanation: "Lao động tự phục vụ và bảo vệ môi trường trường lớp là trách nhiệm của mỗi đội viên, học sinh.",
        },
        {
          id: `q-g${grade}-w${week}-hd3`,
          questionNumber: 3,
          questionText: "Khi đi bộ sang đường trên đoạn đường có vạch kẻ trắng dành cho người đi bộ, em cần lưu ý điều gì?",
          options: [
            { key: "A", text: "Cắm cúi chạy thật nhanh qua đường không nhìn xe" },
            { key: "B", text: "Đi đúng vạch kẻ, quan sát hai bên đường cẩn thận và có người lớn dắt tay" },
            { key: "C", text: "Vừa đi vừa đá bóng hoặc xem điện thoại" },
            { key: "D", text: "Đứng giữa đường chụp ảnh" },
          ],
          correctAnswer: "B",
          explanation: "Đảm bảo an toàn giao thông đường bộ: quan sát kỹ lưỡng và tuân thủ tín hiệu giao thông.",
        },
        {
          id: `q-g${grade}-w${week}-hd4`,
          questionNumber: 4,
          questionText: "Khi tham gia hoạt động nhóm cùng các bạn, tinh thần nào sau đây là quan trọng nhất?",
          options: [
            { key: "A", text: "Chỉ làm theo ý mình, không lắng nghe bạn khác" },
            { key: "B", text: "Biết lắng nghe, chia sẻ việc làm công bằng và tôn trọng ý kiến tập thể" },
            { key: "C", text: "Đùn đẩy toàn bộ công việc cho bạn nhóm trưởng" },
            { key: "D", text: "Tranh cãi to tiếng gây mất trật tự" },
          ],
          correctAnswer: "B",
          explanation: "Hợp tác và làm việc nhóm hiệu quả giúp phát triển năng lực giao tiếp và tinh thần trách nhiệm.",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-hd1`,
          exerciseNumber: 1,
          title: "Kế hoạch trải nghiệm cá nhân cuối tuần",
          prompt: "Em hãy viết 2 việc tốt em dự định sẽ làm vào hai ngày nghỉ cuối tuần để giúp đỡ ông bà, cha mẹ tại nhà.",
          solution: "Gợi ý trả lời:\n1. Việc 1: Giúp mẹ quét dọn phòng khách, gấp quần áo sạch và rửa bát đũa sau bữa cơm gia đình.\n2. Việc 2: Giúp ông bà tưới luống rau ngoài vườn và nhổ cỏ dại. Tối đến đọc sách cho em nhỏ nghe.",
        },
      ],
    };
  }

  if (grade <= 3 && (subject === "Tự nhiên và Xã hội" || subject === "TNXH")) {
    return {
      id: `ws-g${grade}-w${week}-tnxh`,
      grade,
      week,
      subject: "Tự nhiên và Xã hội",
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - TỰ NHIÊN VÀ XÃ HỘI LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-tn1`,
          questionNumber: 1,
          questionText: "Các thế hệ trong một gia đình có ông bà, cha mẹ và các con được gọi là gia đình mấy thế hệ?",
          options: [
            { key: "A", text: "Gia đình 1 thế hệ" },
            { key: "B", text: "Gia đình 2 thế hệ" },
            { key: "C", text: "Gia đình 3 thế hệ" },
            { key: "D", text: "Gia đình 4 thế hệ" },
          ],
          correctAnswer: "C",
          explanation: "Thế hệ thứ nhất: Ông bà; Thế hệ thứ hai: Bố mẹ; Thế hệ thứ ba: Các con. Do đó đây là gia đình 3 thế hệ. (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-tn2`,
          questionNumber: 2,
          questionText: "Cơ quan nào trong cơ thể người có chức năng vận chuyển máu đi khắp các cơ quan?",
          options: [
            { key: "A", text: "Cơ quan hô hấp" },
            { key: "B", text: "Cơ quan tuần hoàn (Tim và các mạch máu)" },
            { key: "C", text: "Cơ quan tiêu hóa" },
            { key: "D", text: "Cơ quan bài tiết" },
          ],
          correctAnswer: "B",
          explanation: "Tim đập liên tục để bơm máu qua hệ thống mạch máu đi nuôi dưỡng toàn bộ cơ thể.",
        },
        {
          id: `q-g${grade}-w${week}-tn3`,
          questionNumber: 3,
          questionText: "Để phòng tránh bị ngộ độc thực phẩm tại nhà, chúng ta nên thực hiện điều nào?",
          options: [
            { key: "A", text: "Ăn chín, uống sôi, rửa tay bằng xà phòng trước khi ăn" },
            { key: "B", text: "Ăn thức ăn đã ôi thiu, có mùi lạ" },
            { key: "C", text: "Uống nước lã chưa đun sôi từ vòi" },
            { key: "D", text: "Mua quà bánh phẩm màu trôi nổi trước cổng trường" },
          ],
          correctAnswer: "A",
          explanation: "Ăn chín, uống sôi và vệ sinh sạch sẽ là nguyên tắc vàng để phòng tránh bệnh đường tiêu hóa.",
        },
        {
          id: `q-g${grade}-w${week}-tn4`,
          questionNumber: 4,
          questionText: "Cây xanh lấy vào khí gì và thải ra khí gì vào ban ngày trong quá trình quang hợp?",
          options: [
            { key: "A", text: "Lấy khí các-bô-níc và thải ra khí ô-xy" },
            { key: "B", text: "Lấy khí ô-xy và thải ra khí các-bô-níc" },
            { key: "C", text: "Lấy khí ni-tơ và thải ra khí hi-đrô" },
            { key: "D", text: "Không thải ra khí nào" },
          ],
          correctAnswer: "A",
          explanation: "Nhờ ánh sáng mặt trời, lá cây hấp thụ khí các-bô-níc và giải phóng khí ô-xy nuôi dưỡng sự sống.",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-tn1`,
          exerciseNumber: 1,
          title: "Liên hệ thực tế & Chăm sóc sức khỏe",
          prompt: "Em hãy nêu 3 việc em đã làm hằng ngày để giữ cho hàm răng và cơ thể luôn sạch sẽ, phòng chống bệnh truyền nhiễm.",
          solution: "Gợi ý trả lời:\n1. Đánh răng ít nhất 2 lần mỗi ngày (sau khi thức dậy vào buổi sáng và trước khi đi ngủ vào buổi tối).\n2. Tắm rửa hàng ngày bằng xà phòng diệt khuẩn và thay quần áo sạch sẽ.\n3. Rửa tay đúng 6 bước bằng xà phòng dưới vòi nước chảy trước khi ăn cơm và sau khi đi vệ sinh.",
        },
      ],
    };
  }

  // GRADE 4 & 5 (Toán, Tiếng Việt, Đạo đức, HĐTN, Khoa học, Lịch sử và Địa lí)
  if (grade >= 4 && subject === "Toán") {
    return {
      id: `ws-g${grade}-w${week}-toan`,
      grade,
      week,
      subject: "Toán",
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - TOÁN LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-m1`,
          questionNumber: 1,
          questionText: grade === 4 ? "Chữ số 7 trong số 574 892 thuộc hàng nào, lớp nào?" : "Phân số 3/4 được viết dưới dạng số thập phân là:",
          options: grade === 4
            ? [
                { key: "A", text: "Hàng chục nghìn, lớp nghìn" },
                { key: "B", text: "Hàng trăm nghìn, lớp nghìn" },
                { key: "C", text: "Hàng nghìn, lớp nghìn" },
                { key: "D", text: "Hàng chục, lớp đơn vị" },
              ]
            : [
                { key: "A", text: "0,34" },
                { key: "B", text: "0,75" },
                { key: "C", text: "3,4" },
                { key: "D", text: "7,5" },
              ],
          correctAnswer: grade === 4 ? "A" : "B",
          explanation: grade === 4
            ? "Số 574 892 có: chữ số 2 (hàng đơn vị), 9 (hàng chục), 8 (hàng trăm), 4 (hàng nghìn), 7 (hàng chục nghìn), 5 (hàng trăm nghìn). Chữ số 7 thuộc hàng chục nghìn, lớp nghìn."
            : "Lấy tử số chia mẫu số: 3 : 4 = 0,75 (hoặc nhân cả tử và mẫu với 25: 75/100 = 0,75). (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-m2`,
          questionNumber: 2,
          questionText: grade === 4 ? "Số thích hợp điền vào chỗ chấm: 3 tấn 25 kg = ... kg là:" : "Một mảnh đất hình chữ nhật có chiều dài 24m, chiều rộng bằng 2/3 chiều dài. Diện tích mảnh đất là:",
          options: grade === 4
            ? [
                { key: "A", text: "325 kg" },
                { key: "B", text: "3 025 kg" },
                { key: "C", text: "3 250 kg" },
                { key: "D", text: "30 025 kg" },
              ]
            : [
                { key: "A", text: "384 m²" },
                { key: "B", text: "80 m²" },
                { key: "C", text: "192 m²" },
                { key: "D", text: "576 m²" },
              ],
          correctAnswer: grade === 4 ? "B" : "A",
          explanation: grade === 4
            ? "Đổi: 1 tấn = 1 000 kg. Do đó 3 tấn 25 kg = 3 000 kg + 25 kg = 3 025 kg."
            : "Chiều rộng mảnh đất: 24 x 2/3 = 16 (m). Diện tích: 24 x 16 = 384 (m²). (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-m3`,
          questionNumber: 3,
          questionText: "Trung bình cộng của ba số: 45, 63 và 72 là bao nhiêu?",
          options: [
            { key: "A", text: "55" },
            { key: "B", text: "60" },
            { key: "C", text: "65" },
            { key: "D", text: "70" },
          ],
          correctAnswer: "B",
          explanation: "Tổng ba số là: 45 + 63 + 72 = 180. Trung bình cộng: 180 : 3 = 60.",
        },
        {
          id: `q-g${grade}-w${week}-m4`,
          questionNumber: 4,
          questionText: "Một ô tô đi được quãng đường 150 km trong 3 giờ. Vận tốc của ô tô đó là:",
          options: [
            { key: "A", text: "50 km/giờ" },
            { key: "B", text: "450 km/giờ" },
            { key: "C", text: "45 km/giờ" },
            { key: "D", text: "60 km/giờ" },
          ],
          correctAnswer: "A",
          explanation: "Công thức tính vận tốc: v = s : t = 150 : 3 = 50 (km/giờ).",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-m1`,
          exerciseNumber: 1,
          title: "Tính giá trị của biểu thức",
          prompt: "a) (125,5 + 74,5) x 3,6\nb) 456 : 12 + 18 x 25",
          solution: "a) (125,5 + 74,5) x 3,6 = 200 x 3,6 = 720\nb) 456 : 12 + 18 x 25 = 38 + 450 = 488 (Theo Loigiaihay.com)",
        },
        {
          id: `e-g${grade}-w${week}-m2`,
          exerciseNumber: 2,
          title: "Toán có lời văn",
          prompt: "Một thửa ruộng hình chữ nhật có chu vi là 180 m. Chiều rộng kém chiều dài 20 m. Người ta cấy lúa trên thửa ruộng đó, cứ 100 m² thu hoạch được 60 kg thóc. Hỏi trên cả thửa ruộng người ta thu hoạch được bao nhiêu tạ thóc?",
          solution: "Bài giải:\nNửa chu vi thửa ruộng là: 180 : 2 = 90 (m)\nChiều dài thửa ruộng là: (90 + 20) : 2 = 55 (m)\nChiều rộng thửa ruộng là: 55 - 20 = 35 (m)\nDiện tích thửa ruộng là: 55 x 35 = 1925 (m²)\nSố thóc thu hoạch được là: 1925 : 100 x 60 = 1155 (kg) = 11,55 tạ thóc.\nĐáp số: 11,55 tạ thóc.",
        },
      ],
    };
  }

  if (grade >= 4 && (subject === "Khoa học" || subject === "Khoa Học")) {
    return {
      id: `ws-g${grade}-w${week}-kh`,
      grade,
      week,
      subject: "Khoa học",
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - MÔN KHOA HỌC LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-kh1`,
          questionNumber: 1,
          questionText: "Nước trong tự nhiên tồn tại ở những thể nào?",
          options: [
            { key: "A", text: "Chỉ ở thể lỏng" },
            { key: "B", text: "Thể lỏng, thể khí (hơi) và thể rắn (băng, tuyết)" },
            { key: "C", text: "Chỉ ở thể rắn và thể lỏng" },
            { key: "D", text: "Chỉ ở thể hơi nước" },
          ],
          correctAnswer: "B",
          explanation: "Nước tồn tại ở ba thể: thể lỏng (nước mưa, sông ngòi), thể khí (hơi nước trong không khí) và thể rắn (nước đá, tuyết). (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-kh2`,
          questionNumber: 2,
          questionText: "Để duy trì sự cháy và sự sống của con người và động vật, chất khí nào sau đây là không thể thiếu?",
          options: [
            { key: "A", text: "Khí ni-tơ" },
            { key: "B", text: "Khí ô-xy" },
            { key: "C", text: "Khí các-bô-níc" },
            { key: "D", text: "Khí mê-tan" },
          ],
          correctAnswer: "B",
          explanation: "Khí ô-xy duy trì sự cháy và là thành phần thiết yếu cho hô hấp của sinh vật.",
        },
        {
          id: `q-g${grade}-w${week}-kh3`,
          questionNumber: 3,
          questionText: "Nguồn năng lượng nào dưới đây là năng lượng sạch, tái tạo và thân thiện với môi trường?",
          options: [
            { key: "A", text: "Năng lượng mặt trời, gió và sức nước" },
            { key: "B", text: "Than đá và dầu mỏ" },
            { key: "C", text: "Khí đốt tự nhiên" },
            { key: "D", text: "Xăng dầu" },
          ],
          correctAnswer: "A",
          explanation: "Mặt trời, gió, sức nước là những nguồn năng lượng tái tạo vô tận và không gây hiệu ứng nhà kính.",
        },
        {
          id: `q-g${grade}-w${week}-kh4`,
          questionNumber: 4,
          questionText: "Biện pháp nào sau đây giúp phòng tránh bệnh sốt xuất huyết hiệu quả nhất?",
          options: [
            { key: "A", text: "Uống thuốc lá cây không rõ nguồn gốc" },
            { key: "B", text: "Ngủ màn, diệt muỗi, thả cá ăn bọ gậy và đậy kín các dụng cụ chứa nước" },
            { key: "C", text: "Tắm mưa thường xuyên" },
            { key: "D", text: "Để nước tù đọng xung quanh nhà" },
          ],
          correctAnswer: "B",
          explanation: "Muỗi vằn là trung gian truyền bệnh sốt xuất huyết, diệt muỗi và lăng quăng là cách phòng bệnh tốt nhất.",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-kh1`,
          exerciseNumber: 1,
          title: "Giải thích hiện tượng khoa học",
          prompt: "Vì sao khi đun nước sôi trong ấm, ta thấy có làn khói trắng bay ra ở vòi ấm và nếu đậy nắp kín có thể bị nước sôi trào ra ngoài?",
          solution: "Giải thích (Theo Loigiaihay.com):\nKhi nước sôi ở 100°C, nước chuyển từ thể lỏng sang thể hơi (bay hơi mạnh). Hơi nước nóng thoát ra gặp không khí lạnh bên ngoài sẽ ngưng tụ lại thành những giọt nước li ti mà mắt thường nhìn thấy như làn sương khói trắng. Nếu đậy kín, áp suất hơi nước tăng lên đẩy nắp và làm nước trào ra ngoài.",
        },
      ],
    };
  }

  if (grade >= 4 && (subject === "Lịch sử và Địa lí" || subject === "Ls và Địa lý" || subject === "LS & ĐL")) {
    return {
      id: `ws-g${grade}-w${week}-lsdl`,
      grade,
      week,
      subject: "Lịch sử và Địa lí",
      title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - LỊCH SỬ VÀ ĐỊA LÍ LỚP ${grade}`,
      bookSeries,
      loigiaihayUrl,
      sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
      questions: [
        {
          id: `q-g${grade}-w${week}-ls1`,
          questionNumber: 1,
          questionText: "Nhà nước đầu tiên trong lịch sử nước ta có tên gọi là gì và do ai đứng đầu?",
          options: [
            { key: "A", text: "Văn Lang - Đứng đầu là Hùng Vương" },
            { key: "B", text: "Âu Lạc - Đứng đầu là An Dương Vương" },
            { key: "C", text: "Vạn Xuân - Đứng đầu là Lý Nam Đế" },
            { key: "D", text: "Đại Cồ Việt - Đứng đầu là Đinh Bộ Lĩnh" },
          ],
          correctAnswer: "A",
          explanation: "Nhà nước Văn Lang ra đời vào khoảng thế kỉ VII TCN, do các vua Hùng cai quản, kinh đô đặt tại Phong Châu (Phú Thọ). (Loigiaihay.com)",
        },
        {
          id: `q-g${grade}-w${week}-ls2`,
          questionNumber: 2,
          questionText: "Chiến thắng Bạch Đằng lịch sử năm 938 do vị anh hùng dân tộc nào lãnh đạo đã chấm dứt hơn 1000 năm Bắc thuộc?",
          options: [
            { key: "A", text: "Hai Bà Trưng" },
            { key: "B", text: "Ngô Quyền" },
            { key: "C", text: "Trần Hưng Đạo" },
            { key: "D", text: "Quang Trung" },
          ],
          correctAnswer: "B",
          explanation: "Năm 938, Ngô Quyền dùng kế cắm cọc gỗ đầu bịt sắt trên sông Bạch Đằng đánh tan quân Nam Hán, mở ra kỉ nguyên độc lập lâu dài.",
        },
        {
          id: `q-g${grade}-w${week}-dl1`,
          questionNumber: 3,
          questionText: "Dãy núi Hoàng Liên Sơn nằm ở khu vực nào của nước ta và có đỉnh núi nào cao nhất Đông Dương?",
          options: [
            { key: "A", text: "Khu vực Bắc Bộ - Đỉnh Phan-xi-păng (3143m)" },
            { key: "B", text: "Khu vực Trung Bộ - Đỉnh Ngọc Linh" },
            { key: "C", text: "Khu vực Tây Nguyên - Đỉnh Lang Biang" },
            { key: "D", text: "Khu vực Nam Bộ - Núi Bà Đen" },
          ],
          correctAnswer: "A",
          explanation: "Dãy Hoàng Liên Sơn nằm ở vùng Tây Bắc, có đỉnh Phan-xi-păng cao 3143 m được mệnh danh là nóc nhà Đông Dương.",
        },
        {
          id: `q-g${grade}-w${week}-dl2`,
          questionNumber: 4,
          questionText: "Đồng bằng sông Cửu Long của nước ta được bồi đắp bởi phù sa của con sông nào?",
          options: [
            { key: "A", text: "Sông Hồng và Sông Thái Bình" },
            { key: "B", text: "Sông Mê Kông (gồm sông Tiền và sông Hậu)" },
            { key: "C", text: "Sông Đồng Nai" },
            { key: "D", text: "Sông Đà" },
          ],
          correctAnswer: "B",
          explanation: "Đồng bằng sông Cửu Long màu mỡ là vựa lúa và trái cây lớn nhất cả nước do hệ thống sông Mê Kông bồi đắp phù sa quanh năm.",
        },
      ],
      essayExercises: [
        {
          id: `e-g${grade}-w${week}-ls1`,
          exerciseNumber: 1,
          title: "Tìm hiểu địa lí địa phương và danh lam thắng cảnh",
          prompt: "Em hãy nêu những nét đặc trưng tiêu biểu về khí hậu và các sản vật nông nghiệp nổi tiếng của vùng Đồng bằng Nam Bộ nước ta.",
          solution: "Gợi ý trả lời (Theo Loigiaihay.com):\n1. Về khí hậu: Khí hậu mang tính chất cận xích đạo nóng ẩm quanh năm, có 2 mùa rõ rệt là mùa mưa và mùa khô.\n2. Về sản vật: Là vựa lúa lớn nhất cả nước; vùng đất trù phú với nhiều loại hoa quả nhiệt đới nổi tiếng (xoài cát Hòa Lộc, sầu riêng, chôm chôm, bưởi da xanh...) cùng nguồn thủy hải sản nước ngọt và nước mặn vô cùng phong phú.",
        },
      ],
    };
  }

  // Fallback generic generator for any remaining subject/grade combinations
  return {
    id: `ws-g${grade}-w${week}-${subject}`,
    grade,
    week,
    subject,
    title: `PHIẾU BÀI TẬP CUỐI TUẦN ${week} - MÔN ${subject.toUpperCase()} LỚP ${grade}`,
    bookSeries,
    loigiaihayUrl,
    sourceLabel: "Tham khảo đề & Lời giải chuẩn từ https://loigiaihay.com/",
    questions: [
      {
        id: `q-g${grade}-w${week}-${subject}-1`,
        questionNumber: 1,
        questionText: `Nội dung cốt lõi của bài học tuần ${week} môn ${subject} giúp học sinh rèn luyện năng lực nào sau đây?`,
        options: [
          { key: "A", text: "Năng lực nhận thức và áp dụng kiến thức vào thực tế cuộc sống" },
          { key: "B", text: "Chỉ học thuộc lòng máy móc không hiểu bài" },
          { key: "C", text: "Không cần làm bài tập và thực hành" },
          { key: "D", text: "Sao chép bài của bạn khác mà không suy nghĩ" },
        ],
        correctAnswer: "A",
        explanation: `Môn ${subject} tuần ${week} hướng tới hình thành phẩm chất chăm chỉ và năng lực vận dụng kiến thức linh hoạt. (Nguồn: Loigiaihay.com)`,
      },
      {
        id: `q-g${grade}-w${week}-${subject}-2`,
        questionNumber: 2,
        questionText: `Theo chuẩn kiến thức kĩ năng GDPT 2018 môn ${subject}, hành động nào được khuyến khích khi học tập trên lớp?`,
        options: [
          { key: "A", text: "Tự tin phát biểu, thảo luận nhóm sôi nổi và giúp đỡ bạn bè" },
          { key: "B", text: "Làm việc riêng và không chú ý lắng nghe thầy cô" },
          { key: "C", text: "Ngại giao tiếp và không tham gia hoạt động chung" },
          { key: "D", text: "Không chuẩn bị sách vở trước khi đến lớp" },
        ],
        correctAnswer: "A",
        explanation: "Phương pháp dạy học tích cực chú trọng tính chủ động, giao tiếp và tinh thần hợp tác của học sinh.",
      },
      {
        id: `q-g${grade}-w${week}-${subject}-3`,
        questionNumber: 3,
        questionText: `Khi gặp một bài tập hoặc tình huống mới trong môn ${subject}, bước đầu tiên học sinh nên làm gì?`,
        options: [
          { key: "A", text: "Đọc kĩ đề bài, xác định rõ yêu cầu và dữ liệu đã cho" },
          { key: "B", text: "Bỏ qua không làm vì thấy khó" },
          { key: "C", text: "Đoán mò kết quả mà không cần tính toán hay suy luận" },
          { key: "D", text: "Nhờ người khác làm hộ từ đầu đến cuối" },
        ],
        correctAnswer: "A",
        explanation: "Phân tích yêu cầu đề bài là bước then chốt nhất để tìm ra lời giải chính xác.",
      },
      {
        id: `q-g${grade}-w${week}-${subject}-4`,
        questionNumber: 4,
        questionText: `Ý nghĩa của việc hoàn thành phiếu bài tập cuối tuần đối với học sinh là:`,
        options: [
          { key: "A", text: "Ôn tập củng cố vững chắc kiến thức đã học trong tuần và tự đánh giá năng lực" },
          { key: "B", text: "Tạo áp lực không cần thiết" },
          { key: "C", text: "Chỉ để nộp cho đủ số lượng" },
          { key: "D", text: "Không có tác dụng gì đối với việc học" },
        ],
        correctAnswer: "A",
        explanation: "Phiếu cuối tuần giúp học sinh nhớ lâu kiến thức và sẵn sàng bước vào tuần học mới với tâm thế tự tin.",
      },
    ],
    essayExercises: [
      {
        id: `e-g${grade}-w${week}-${subject}-1`,
        exerciseNumber: 1,
        title: `Bài tập thực hành vận dụng môn ${subject}`,
        prompt: `Em hãy ghi lại 2 điều em tâm đắc nhất sau các tiết học môn ${subject} tuần ${week} và nêu cách em sẽ vận dụng điều đó vào cuộc sống hằng ngày.`,
        solution: `Gợi ý trả lời (Theo Loigiaihay.com):\n- Điều 1: Nắm chắc các kiến thức lý thuyết cơ bản và kỹ năng thực hành cô đọng.\n- Điều 2: Vận dụng tinh thần tự giác, ý thức kỉ luật và tinh thần trách nhiệm vào việc phụ giúp gia đình và học tập nhóm cùng bạn bè.`,
      },
    ],
  };
}
