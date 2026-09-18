import { LessonPlan, IntegratedTag, GradeLevel } from "../types";

export const standardIntegrationsCatalog: IntegratedTag[] = [
  // Năng lực số (CV 3456/BGDĐT)
  {
    id: "nls-1-1",
    type: "NLS",
    code: "NLS 1.1.CB1a",
    title: "Tìm kiếm thông tin số an toàn",
    description: "Xác định được thông tin cần tìm, thực hiện tìm kiếm đơn giản trong môi trường số dưới sự hướng dẫn của GV/người lớn; biết chọn nguồn đọc an toàn, không bấm vào liên kết lạ.",
  },
  {
    id: "nls-1-2",
    type: "NLS",
    code: "NLS 1.2.CB1a",
    title: "Đánh giá độ tin cậy thông tin số",
    description: "Phát hiện được độ tin cậy và độ chính xác của nguồn dữ liệu, thông tin số; đối chiếu với SGK và nguồn chính thống.",
  },
  {
    id: "nls-2-3",
    type: "NLS",
    code: "NLS 2.3.CB1a",
    title: "Giao tiếp và ứng xử số văn minh",
    description: "Biết trao đổi ý kiến lịch sự khi làm việc nhóm trên công cụ số; chỉ chia sẻ nội dung phù hợp, không công khai thông tin riêng tư.",
  },
  {
    id: "nls-3-1",
    type: "NLS",
    code: "NLS 3.1.CB1a",
    title: "Tạo nội dung số đơn giản",
    description: "Sử dụng công cụ số đơn giản để tạo sơ đồ, bảng biểu, hình ảnh minh họa cho bài học một cách rõ ràng.",
  },
  {
    id: "nls-4-1",
    type: "NLS",
    code: "NLS 4.1.CB1b",
    title: "Bảo vệ thông tin cá nhân & thiết bị",
    description: "Nhận biết các nguy cơ rủi ro trên mạng; không chia sẻ thông tin cá nhân, tài khoản, hình ảnh riêng tư khi chưa được phép.",
  },
  {
    id: "nls-5-2",
    type: "NLS",
    code: "NLS 5.2.CB1a",
    title: "Sử dụng công cụ số hỗ trợ học tập",
    description: "Sử dụng bảng tương tác, Quizizz, Wordwall, bảng tính để tự kiểm tra đáp án, luyện tập và trình bày kết quả.",
  },

  // Trí tuệ nhân tạo (AI)
  {
    id: "ai-1",
    type: "AI",
    code: "AI (YCCĐ 2.A1.1 / 4.A1.1)",
    title: "Nhận biết vai trò & hỗ trợ của AI",
    description: "HS nhận biết AI là công cụ hỗ trợ xử lý dữ liệu, gợi ý ý tưởng nhanh chóng; hiểu AI không có cảm xúc thật và con người luôn là trung tâm điều khiển, kiểm tra kết quả.",
  },
  {
    id: "ai-2",
    type: "AI",
    code: "AI (YCCĐ 2.A1.2 / 4.A1.2)",
    title: "Thái độ đúng đắn khi sử dụng AI",
    description: "HS biết tham khảo gợi ý của AI (từ ngữ, dàn ý, giải toán) nhưng không sao chép máy móc; tự kiểm tra và viết bằng cảm xúc, kiến thức thật của mình.",
  },
  {
    id: "ai-3",
    type: "AI",
    code: "AI (YCCĐ 2.A2.1 / 4.A2.1)",
    title: "Ứng dụng AI trong đời sống và học tập",
    description: "Nhận biết các thiết bị gia dụng và học tập tích hợp AI (robot hút bụi, loa thông minh nhắc việc, camera nhận diện, ứng dụng dịch thuật).",
  },
  {
    id: "ai-4",
    type: "AI",
    code: "AI (YCCĐ 2.C3.1 / 4.C5.1)",
    title: "Phân loại & nhận diện hình ảnh qua AI",
    description: "Trải nghiệm công cụ AI nhận diện đồ vật/hình khối/con vật qua camera; nhận thức AI có thể nhận diện sai nếu hình ảnh mờ hoặc thiếu dữ liệu.",
  },
  {
    id: "ai-5",
    type: "AI",
    code: "AI (YCCĐ 2.D1.1 / 4.D1.1)",
    title: "Đề xuất ý tưởng ứng dụng AI giải quyết vấn đề",
    description: "Hình thành ý tưởng thiết kế mô hình máy/robot thông minh hỗ trợ cuộc sống, bảo vệ môi trường, cứu hộ cứu nạn.",
  },

  // QPAN / GDQPAN
  {
    id: "qpan-1",
    type: "QPAN",
    code: "GDQPAN (TT 08/2024)",
    title: "Chủ quyền biển đảo & Lòng yêu nước",
    description: "Khẳng định chủ quyền thiêng liêng của Việt Nam đối với hai quần đảo Hoàng Sa và Trường Sa trên bản đồ Tổ quốc; bồi dưỡng lòng tự hào dân tộc, biết ơn người có công bảo vệ Tổ quốc.",
  },
  {
    id: "qpan-2",
    type: "QPAN",
    code: "GDQPAN (Bộ đội Cụ Hồ)",
    title: "Hình ảnh chú bộ đội & Tinh thần đoàn kết",
    description: "Giới thiệu hình ảnh cán bộ, chiến sĩ Quân đội Nhân dân và Công an Nhân dân làm nhiệm vụ canh giữ biên cương, cứu hộ cứu nạn; rèn tác phong kỉ luật, nề nếp.",
  },

  // QCN / Quyền trẻ em
  {
    id: "qcn-1",
    type: "QCN",
    code: "Quyền con người (QCN)",
    title: "Tôn trọng sự khác biệt & Quyền được học tập",
    description: "HS hiểu quyền được học tập, vui chơi, bày tỏ ý kiến trong môi trường an toàn; biết tôn trọng đặc điểm, ngoại hình và năng khiếu của bạn bè, không chê bai trêu chọc.",
  },
  {
    id: "qcn-2",
    type: "QCN",
    code: "Quyền trẻ em",
    title: "Quyền được chăm sóc & bảo vệ an toàn",
    description: "Trẻ em có quyền được sống trong gia đình yêu thương, được chăm sóc sức khỏe, phòng tránh xâm hại; biết tìm sự trợ giúp từ người lớn đáng tin cậy.",
  },

  // Giáo dục Dinh dưỡng
  {
    id: "gddd-1",
    type: "GDDD",
    code: "Giáo dục Dinh dưỡng",
    title: "Ăn uống đủ chất & Lành mạnh",
    description: "Giáo dục về tầm quan trọng của việc ăn đủ 4 nhóm chất dinh dưỡng, ăn đúng giờ, ăn nhiều rau quả xanh để cơ thể khỏe mạnh, phát triển chiều cao và trí tuệ.",
  },

  // Bảo vệ môi trường (BVMT)
  {
    id: "bvmt-1",
    type: "BVMT",
    code: "Bảo vệ môi trường (BVMT)",
    title: "Giữ gìn vệ sinh & Sống xanh",
    description: "Bỏ rác đúng nơi quy định, phân loại rác thải, chăm sóc bảo vệ cây xanh trường lớp, không bẻ cành hái hoa, giữ gìn cảnh quan xanh - sạch - đẹp.",
  },
  {
    id: "bvmt-2",
    type: "BVMT",
    code: "Bảo vệ môi trường (BVMT)",
    title: "Tiết kiệm & Bảo vệ nguồn nước",
    description: "HS biết sử dụng nước tiết kiệm, khóa vòi sau khi dùng, không xả rác và chất bẩn xuống ao hồ, kênh rạch, sông biển.",
  },

  // KNS & HTQC
  {
    id: "kns-1",
    type: "KNS",
    code: "Kĩ năng sống (KNS)",
    title: "Kĩ năng giao tiếp & Phòng tránh tai nạn",
    description: "Chào hỏi lễ phép, nói lời cảm ơn/xin lỗi, hợp tác nhóm đoàn kết; kĩ năng an toàn giao thông, phòng tránh đuối nước, phòng cháy chữa cháy.",
  },
  {
    id: "htqc-1",
    type: "HTQC",
    code: "Học thông qua chơi (Bộ phận)",
    title: "Học thông qua chơi tương tác",
    description: "Củng cố kiến thức bằng các trò chơi khởi động, thi đấu tiếp sức, gài thẻ số, đối mặt tính nhanh, tiếp sức đồng đội.",
  },
];

// Sample Preloaded Lesson Plans for Grade 5 Week 1
export const defaultGrade5Week1Plans: LessonPlan[] = [
  {
    id: "khbd-g5-w1-hdtn1",
    grade: 5,
    subject: "Hoạt động trải nghiệm",
    topic: "Chủ đề 1: Em lớn lên mỗi ngày",
    lessonTitle: "Sinh hoạt dưới cờ: LỄ KHAI GIẢNG NĂM HỌC MỚI",
    period: "Tiết 1 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 1,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Học sinh nghiêm túc tham gia Lễ Khai giảng năm học mới, cảm nhận không khí trang nghiêm, phấn khởi bước vào năm học cuối cấp tiểu học.",
      ],
      generalCompetencies: [
        "Năng lực tự chủ, tự quản lí bản thân trong tập thể.",
        "Năng lực giao tiếp và hợp tác tập thể trong ngày hội trường.",
      ],
      qualities: [
        "Nhân ái, trách nhiệm, lòng tự hào về mái trường mến yêu và truyền thống hiếu học.",
      ],
    },
    integratedContent: "Tích hợp Nghi thức Khai giảng, Chào cờ đầu năm, Quyền được học tập và tham gia hoạt động nhà trường (QCN).",
    integrationTags: [
      { id: "qcn-1", type: "QCN", code: "QCN", title: "Quyền được học tập & hòa nhập", description: "Tham gia lễ khai giảng trang nghiêm." }
    ],
    equipment: {
      teacher: "Loa đài, cờ Tổ quốc, hoa chúc mừng, bài phát biểu.",
      students: "Ghế ngồi cá nhân, trang phục chỉnh tề, cờ hoa cầm tay.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Tập trung học sinh ngăn nắp, tạo tâm thế sẵn sàng cho buổi lễ.",
        time: "5 - 7 phút",
        teacherActivity: "- Tổ chức tập hợp học sinh lớp 5A xếp hàng dọc ngay ngắn.\n- Nhắc nhở HS chỉnh đốn trang phục, kiểm tra sĩ số lớp.",
        studentActivity: "- Di chuyển ra sân trường, xếp hàng thẳng thắn theo vị trí lớp 5A.\n- Chỉnh đốn trang phục, mũ nón nghiêm túc.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Thực hiện nghi lễ chào cờ trang nghiêm và lắng nghe thư Chủ tịch nước.",
        time: "10 - 15 phút",
        teacherActivity: "- Điều hành nghi lễ Chào cờ, hát Quốc ca trang trọng.\n- Giới thiệu đại biểu và Ban giám hiệu đọc thư của Chủ tịch nước.",
        studentActivity: "- Đứng trang nghiêm hướng về Quốc kỳ, hát vang bài Quốc ca tự hào.\n- Chăm chú lắng nghe đọc thư của Chủ tịch nước.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Tham gia các hoạt động chào mừng và văn nghệ tập thể.",
        time: "12 - 15 phút",
        teacherActivity: "- Hướng dẫn HS nồng nhiệt cổ vũ các tiết mục văn nghệ chào mừng.\n- Tổ chức đón các em học sinh lớp 1 vào trường.",
        studentActivity: "- Vỗ tay, reo hò cổ vũ các tiết mục của thầy cô và bạn bè.\n- Nhiệt tình vẫy cờ hoa chào đón các em học sinh lớp 1.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Khắc sâu quyết tâm học tập tốt năm học cuối cấp.",
        time: "5 - 7 phút",
        teacherActivity: "- Phát động phong trào thi đua tuần 1: 'Học sinh lớp 5 gương mẫu đầu đàn'.\n- Dặn dò nề nếp xếp hàng và giữ vệ sinh sân trường.",
        studentActivity: "- Hô vang khẩu hiệu thể hiện sự quyết tâm thực hiện tốt thi đua.\n- Thu dọn ghế ngồi ngăn nắp, nhặt rác xung quanh vị trí ngồi.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-tv1",
    grade: 5,
    subject: "Tiếng Việt 5 (Đọc)",
    topic: "Chủ điểm 1: Thế giới tuổi thơ",
    lessonTitle: "Bài 1: THANH ÂM CỦA GIÓ",
    period: "Tiết 2 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 2,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Đọc trôi chảy toàn bài, ngắt nghỉ hơi đúng nhịp ở các câu dài; hiểu nội dung bài học nói về niềm vui của tuổi thơ khi khám phá thế giới tự nhiên phong phú.",
      ],
      generalCompetencies: [
        "Phát triển năng lực tự học, tự rèn đọc từ khó.",
        "Năng lực ngôn ngữ đọc diễn cảm và cảm thụ vẻ đẹp ngôn từ.",
      ],
      qualities: [
        "Chăm chỉ học tập, bồi dưỡng tình yêu thiên nhiên đất nước quê hương.",
      ],
    },
    integratedContent: "Tích hợp NLS: Khai thác thông tin số an toàn; Tích hợp Bảo vệ môi trường cảnh quan.",
    integrationTags: [
      { id: "nls-1-1", type: "NLS", code: "NLS 1.1.CB1a", title: "Khai thác thông tin số an toàn", description: "Tra cứu thông tin âm thanh tự nhiên." }
    ],
    equipment: {
      teacher: "Sách giáo khoa Tiếng Việt 5, tranh minh họa bài đọc, tivi chiếu câu dài cần ngắt nhịp.",
      students: "Sách giáo khoa, chuẩn bị bài đọc trước ở nhà.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Tạo không khí vui tươi, kích thích tò mò về âm thanh thiên nhiên.",
        time: "5 - 7 phút",
        teacherActivity: "- GV mở âm thanh tiếng gió thổi rì rào trên loa.\n- Hỏi: 'Em nghe thấy âm thanh gì? Em có bao giờ lắng nghe tiếng gió nói chuyện chưa?'",
        studentActivity: "- Lắng nghe âm thanh và hào hứng trả lời: Tiếng gió thổi rì rào.\n- Chia sẻ cảm xúc cá nhân về những âm thanh của gió mà mình từng nghe.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Đọc đúng toàn bài, sửa lỗi phát âm và ngắt nghỉ câu dài chính xác.",
        time: "10 - 15 phút",
        teacherActivity: "- Đọc mẫu toàn bài dõng dạc, truyền cảm.\n- Hướng dẫn học sinh chia đoạn bài đọc và luyện đọc nối tiếp theo đoạn.\n- Sửa lỗi phát âm các từ khó: rì rào, xào xạc, uốn lượn...",
        studentActivity: "- Theo dõi sách giáo khoa, đọc thầm theo giáo viên.\n- Nối tiếp nhau đọc từng đoạn trước lớp; sửa lỗi phát âm theo hướng dẫn của GV.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Đọc hiểu chi tiết bài đọc và thảo luận nhóm về giá trị âm thanh cuộc sống.",
        time: "12 - 15 phút",
        teacherActivity: "- Tổ chức cho HS thảo luận nhóm 4 trả lời các câu hỏi tìm hiểu bài trong SGK.\n- Tích hợp NLS: Hướng dẫn học sinh tìm kiếm thêm thông tin về các âm thanh tự nhiên từ nguồn internet an toàn.",
        studentActivity: "- Thảo luận nhóm trả lời câu hỏi đọc hiểu về cảm xúc của các nhân vật.\n- Ghi chép từ khóa tìm kiếm do GV gợi ý về âm thanh tự nhiên.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Khắc sâu lòng yêu thiên nhiên và tự giác luyện đọc hằng ngày.",
        time: "5 - 7 phút",
        teacherActivity: "- Nhận xét tiết học, khuyến khích học sinh về nhà tập lắng nghe âm thanh quanh nhà và tập đọc bài diễn cảm cho người thân nghe.",
        studentActivity: "- Lắng nghe và ghi nhớ nhiệm vụ về nhà tự luyện đọc bài dồi dào cảm xúc.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-tv2",
    grade: 5,
    subject: "Tiếng Việt 5 (LTVC)",
    topic: "Chủ điểm 1: Thế giới tuổi thơ",
    lessonTitle: "Bài học: LUYỆN TẬP VỀ DANH TỪ, ĐỘNG TỪ, TÍNH TỪ",
    period: "Tiết 3 (Tiết PPCT 2)",
    ppctNumber: 2,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 3,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Học sinh củng cố và hệ thống hóa kiến thức về danh từ, động từ, tính từ; nhận diện đúng các loại từ này trong câu văn, đoạn văn cụ thể.",
      ],
      generalCompetencies: [
        "Năng lực tự chủ giải quyết bài tập cá nhân độc lập.",
        "Năng lực hợp tác nhóm đôi soát lỗi.",
      ],
      qualities: [
        "Chăm chỉ, cẩn thận rèn luyện sử dụng từ ngữ Tiếng Việt chuẩn xác.",
      ],
    },
    integratedContent: "Tích hợp QCN: Tôn trọng sự khác biệt trong năng lực học tập của bạn học.",
    integrationTags: [
      { id: "qcn-1", type: "QCN", code: "QCN", title: "Tôn trọng sự khác biệt", description: "Tôn trọng năng lực học tập của bạn khi làm việc nhóm." }
    ],
    equipment: {
      teacher: "Bảng phụ ghi các đoạn văn mẫu, phiếu bài tập phân loại từ.",
      students: "Vở bài tập Tiếng Việt 5, bút chì.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Tái hiện nhanh kiến thức về 3 loại từ đã học ở lớp dưới.",
        time: "5 - 7 phút",
        teacherActivity: "- Tổ chức trò chơi 'Đố từ nhanh': Giáo viên đưa ra một từ, học sinh đoán nhanh đó là danh từ, động từ hay tính từ.\n- Khen ngợi và dẫn dắt vào bài mới.",
        studentActivity: "- Tập trung lắng nghe và hô to thể loại từ: 'chạy' -> Động từ; 'hoa hồng' -> Danh từ; 'đẹp' -> Tính từ.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Hệ thống hóa đặc điểm của danh từ, động từ, tính từ.",
        time: "10 - 15 phút",
        teacherActivity: "- Hướng dẫn học sinh nhắc lại khái niệm danh từ (chỉ sự vật), động từ (chỉ hoạt động, trạng thái), tính từ (chỉ đặc điểm, tính chất).\n- Cho ví dụ minh họa cụ thể.",
        studentActivity: "- Phát biểu dõng dạc khái niệm và lấy ví dụ sinh động trước lớp.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Thực hành phân loại từ ngữ trong đoạn văn bài đọc 'Thanh âm của gió'.",
        time: "12 - 15 phút",
        teacherActivity: "- Giao bài tập 1, 2 trong SGK: Yêu cầu tìm danh từ, động từ, tính từ trong đoạn văn.\n- Tích hợp QCN: Giáo dục HS biết tôn trọng sự khác biệt trong năng lực học tập của bạn học khi hoạt động nhóm.",
        studentActivity: "- Độc lập suy nghĩ làm bài tập vào vở học.\n- Thảo luận nhóm đôi trao đổi vở chéo soát bài và giúp đỡ nhau sửa các lỗi từ phân loại sai.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Ứng dụng viết câu văn ngắn gọn sử dụng cả 3 loại từ.",
        time: "5 - 7 phút",
        teacherActivity: "- Giao nhiệm vụ đặt một câu văn miêu tả bầu trời tuần mới chứa ít nhất một danh từ, một động từ và một tính từ.",
        studentActivity: "- Tự đặt câu văn hay vào vở và tự tin đọc to trước cả lớp.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-toan1",
    grade: 5,
    subject: "Toán 5",
    topic: "Chủ đề 1: Ôn tập và bổ sung",
    lessonTitle: "Bài 1: ÔN TẬP SỐ TỰ NHIÊN (TIẾT 1)",
    period: "Tiết 4 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 4,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Đọc, viết được số tự nhiên; Viết được số tự nhiên thành tổng các số hạng theo hàng. Vận dụng giải quyết tình huống thực tế.",
      ],
      generalCompetencies: [
        "Năng lực tự chủ, giải quyết vấn đề toán học và năng lực giao tiếp toán học dõng dạc.",
      ],
      qualities: [
        "Trách nhiệm, chăm chỉ học tập nghiêm túc, cẩn thận trong tính toán.",
      ],
    },
    integratedContent: "Tích hợp học thông qua chơi (Bộ phận): Gài thẻ số vào ô trống; Vận dụng làm tròn số liệu thực tế đời sống.",
    integrationTags: [
      { id: "htqc-1", type: "HTQC", code: "HTQC", title: "Học thông qua chơi", description: "Trò chơi tìm số thích hợp điền vào ô trống." }
    ],
    equipment: {
      teacher: "Bộ đồ dùng dạy học Toán 5, bảng phụ vẽ bảng lớp cấu trúc hàng đơn vị.",
      students: "Bảng con, phấn, vở ghi chép Toán 5.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Tạo không khí rực rỡ và kiểm tra kiến thức cũ của học sinh.",
        time: "5 - 7 phút",
        teacherActivity: "- Tổ chức trò chơi 'Đố bạn': Một bạn viết số có nhiều chữ số lên bảng lớp, bạn khác đọc to và phân tích cấu trúc hàng của số đó.",
        studentActivity: "- HS sôi nổi tham gia chơi. Ví dụ: Viết số 52 814, bạn khác đọc: Năm mươi hai nghìn tám trăm mười bốn.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Ôn tập lại cấu trúc hệ thập phân và giá trị của từng chữ số theo hàng.",
        time: "10 - 15 phút",
        teacherActivity: "- Cho học sinh quan sát bảng hệ thập phân trong SGK.\n- Hỏi về giá trị của chữ số 5 trong số 52 814 nằm ở hàng nào?",
        studentActivity: "- Quan sát bảng số, phát biểu: Chữ số 5 nằm ở hàng chục nghìn, có giá trị là 50 000.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Hoàn thành các bài tập thực hành đọc viết và viết số thành tổng hàng.",
        time: "12 - 15 phút",
        teacherActivity: "- Tổ chức cho HS làm Bài 1, Bài 2 trong SGK vào vở cá nhân.\n- Tích hợp học thông qua chơi (Bộ phận): Giao phiếu học tập trò chơi nhóm tìm số thích hợp điền vào ô trống.",
        studentActivity: "- Hoàn thành nhanh chóng các bài tập đặt tính và so sánh số vào vở.\n- Tham gia thảo luận nhóm gài thẻ chữ số thích hợp vào bảng số.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Vận dụng làm tròn số và đọc số liệu thực tế đời sống.",
        time: "5 - 7 phút",
        teacherActivity: "- Đưa thông tin độ cao ngọn núi trong SGK (Đỉnh núi Bà Đen cao 986 m), yêu cầu học sinh làm tròn số đến hàng trăm.",
        studentActivity: "- Thực hiện làm tròn số 986 thành 1 000 m và hào hứng giải thích kết quả làm tròn của mình.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-kh1",
    grade: 5,
    subject: "Khoa học 5",
    topic: "Chủ đề 1: Chất",
    lessonTitle: "Bài 1: THÀNH PHẦN VÀ VAI TRÒ CỦA ĐẤT ĐỐI VỚI CÂY TRỒNG (TIẾT 1)",
    period: "Tiết 1 Chiều (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Chiều",
    periodInDay: 1,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Học sinh bước đầu nhận biết được các thành phần chính có trong đất trồng như chất khoáng, mùn, nước, không khí và các sinh vật đất.",
      ],
      generalCompetencies: [
        "Năng lực tự khám phá thế giới tự nhiên; năng lực quan sát, thực nghiệm trực quan và rút ra kết luận khoa học.",
      ],
      qualities: [
        "Chăm chỉ chăm sóc cây cối, có trách nhiệm bảo vệ đất trồng sạch đẹp.",
      ],
    },
    integratedContent: "Tích hợp bảo vệ môi trường đất: Không vứt rác thải nhựa bừa bãi làm hỏng kết cấu đất.",
    integrationTags: [
      { id: "bvmt-1", type: "BVMT", code: "BVMT", title: "Bảo vệ môi trường đất", description: "Ý thức bảo vệ đất sạch và thu gom rác." }
    ],
    equipment: {
      teacher: "Một cốc thủy tinh đựng mẫu đất khô, nước sạch, thìa khuấy, tranh ảnh thành phần của đất.",
      students: "Sách giáo khoa Khoa học 5, bút ghi chép thực nghiệm.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Khơi gợi trí tò mò của học sinh về đất trồng xung quanh mình.",
        time: "5 - 7 phút",
        teacherActivity: "- GV hỏi: 'Để cây xanh phát triển khỏe mạnh, rễ cây bám vào đâu? Đất có những gì trong đó?' Dẫn dắt bài mới.",
        studentActivity: "- Hăng hái giơ tay trả lời: Rễ bám vào đất. Trong đất có cát, mùn, nước, giun đất...",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Thực hiện thí nghiệm trực quan phát hiện nước và không khí trong đất.",
        time: "10 - 15 phút",
        teacherActivity: "- Thả một cục đất khô vào cốc nước sạch. Yêu cầu HS quan sát hiện tượng sủi bọt khí.\n- Giải thích: Bọt khí thoát ra chứng tỏ trong đất có không khí.",
        studentActivity: "- Chăm chú theo dõi thí nghiệm của giáo viên.\n- Phát hiện hiện tượng sủi bọt và rút ra kết luận: Đất có chứa không khí bên trong.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Tìm hiểu vai trò của chất mùn và chất khoáng đối với sự sống của cây.",
        time: "12 - 15 phút",
        teacherActivity: "- Cho học sinh thảo luận nhóm đôi tìm hiểu chất mùn được hình thành từ đâu? Nó giúp ích gì cho rễ cây hấp thụ?\n- Tích hợp Bảo vệ môi trường: Nâng cao ý thức không vứt rác thải nhựa bừa bãi làm hỏng kết cấu đất.",
        studentActivity: "- Thảo luận nhóm, xác định chất mùn hình thành từ xác động thực vật phân hủy, cung cấp dinh dưỡng cho cây.\n- Cam kết bỏ rác đúng nơi quy định để bảo vệ đất sạch.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Vận dụng thực tế bảo quản chậu cây trang trí lớp học sạch sẽ.",
        time: "5 - 7 phút",
        teacherActivity: "- Hướng dẫn học sinh cách xới đất chậu cây hoa của lớp nhẹ nhàng để không khí dễ luồn vào rễ cây nuôi dưỡng tốt hơn.",
        studentActivity: "- Tự giác phân công xới đất, tưới nước cho các chậu cây cảnh ở góc thiên nhiên lớp 5A ngăn nắp.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-tv-viet",
    grade: 5,
    subject: "Tiếng Việt 5 (Viết)",
    topic: "Chủ điểm 1: Thế giới tuổi thơ",
    lessonTitle: "Bài học: TÌM HIỂU CÁCH VIẾT BÀI VĂN KỂ CHUYỆN SÁNG TẠO",
    period: "Tiết 2 Chiều (Tiết PPCT 3)",
    ppctNumber: 3,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Chiều",
    periodInDay: 2,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Học sinh hiểu được cấu trúc và yêu cầu của bài văn kể chuyện sáng tạo (thêm chi tiết tưởng tượng, thay đổi ngôi kể hoặc thêm lời thoại sinh động).",
      ],
      generalCompetencies: [
        "Năng lực tự chủ sáng tạo ý tưởng; năng lực ngôn ngữ diễn đạt trôi chảy cuốn hút người đọc.",
      ],
      qualities: [
        "Chăm chỉ rèn luyện viết văn, tôn trọng nét độc đáo sáng tạo của bạn học.",
      ],
    },
    integratedContent: "Tích hợp AI: Gợi ý ý tưởng kể chuyện sáng tạo, kiểm soát không sao chép văn mẫu máy móc.",
    integrationTags: [
      { id: "ai-2", type: "AI", code: "AI (YCCĐ 4.A1.2)", title: "Sử dụng AI hỗ trợ ý tưởng", description: "Tham khảo gợi ý ChatGPT nhưng viết bằng cảm xúc thật." }
    ],
    equipment: {
      teacher: "Văn bản câu chuyện mẫu trước và sau khi được kể chuyện sáng tạo, bảng tiêu chí đánh giá bài văn kể chuyện sáng tạo.",
      students: "Sách giáo khoa, vở nháp viết văn.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Kích thích trí tưởng tượng phong phú của học sinh trước giờ viết.",
        time: "5 - 7 phút",
        teacherActivity: "- GV kể một đoạn câu chuyện 'Sự tích dưa hấu' bằng giọng điệu quen thuộc, sau đó thêm chi tiết về suy nghĩ nội tâm của Mai An Tiêm.\n- Hỏi: 'Em thấy cách kể sau có gì hay và mới lạ hơn?'",
        studentActivity: "- Lắng nghe say sưa câu chuyện của thầy giáo.\n- Nhận xét: Cách kể sau sinh động hơn vì biết suy nghĩ sâu sắc của nhân vật.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Tìm hiểu các cách kể chuyện sáng tạo cơ bản.",
        time: "10 - 15 phút",
        teacherActivity: "- Hướng dẫn học sinh đọc câu chuyện mẫu trong SGK.\n- Chỉ ra các cách làm cho câu chuyện thêm sáng tạo: 1. Thêm lời thoại; 2. Thêm chi tiết miêu tả ngoại hình, phong cảnh; 3. Thay đổi kết thúc truyện tốt đẹp hơn.",
        studentActivity: "- Đọc nối tiếp câu chuyện mẫu, phát hiện các chi tiết sáng tạo được in nghiêng trong văn bản bài học.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Phân tích bài văn mẫu và thực hành tưởng tượng thêm lời thoại ngắn.",
        time: "12 - 15 phút",
        teacherActivity: "- Tổ chức thảo luận nhóm 4: Đọc một câu chuyện cổ tích quen thuộc và bàn bạc xem có thể thêm lời nói hay suy nghĩ gì cho nhân vật chính?\n- Tích hợp AI: GV giới thiệu ChatGPT/Gemini có thể gợi ý dàn ý, nhưng câu chữ và cảm xúc chân thật phải do chính học sinh viết ra.",
        studentActivity: "- Sôi nổi thảo luận nhóm chọn câu chuyện 'Tấm Cám' để thêm lời thoại nội tâm lúc Tấm hóa thành chim vàng anh.\n- Rút kinh nghiệm không sao chép máy móc văn mẫu từ mạng.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Thực hành tự sáng tạo một đoạn văn ngắn tự hào.",
        time: "5 - 7 phút",
        teacherActivity: "- Giao nhiệm vụ viết một đoạn văn ngắn 3-4 câu kể lại một tình huống em giúp đỡ bạn học, trong đó có thêm lời thoại trò chuyện thân thiện.",
        studentActivity: "- Tự nắn nót viết đoạn văn vào vở và đọc chia sẻ hào hứng trước cả lớp.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g5-w1-tctv",
    grade: 5,
    subject: "Tăng cường Tiếng Việt 5",
    topic: "Chủ điểm 1: Thế giới tuổi thơ",
    lessonTitle: "Bài học: LUYỆN TẬP TIẾNG VIỆT (TIẾT 1)",
    period: "Tiết 3 Chiều (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Chiều",
    periodInDay: 3,
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    objectives: {
      specificCompetencies: [
        "Học sinh ôn tập và củng cố kĩ năng đọc trơn trôi chảy, lưu loát bài 'Thanh âm của gió'; rèn kĩ năng viết chữ hoa nắn nót đúng khoảng cách.",
      ],
      generalCompetencies: [
        "Năng lực tự quản lí thời gian luyện đọc cá nhân; năng lực hợp tác nhóm đôi sửa lỗi chính tả.",
      ],
      qualities: [
        "Chăm chỉ siêng năng rèn luyện nét chữ nết người sạch đẹp.",
      ],
    },
    integratedContent: "Ôn đọc lưu loát bài 'Thanh âm của gió', rèn nếp viết chữ đẹp.",
    integrationTags: [
      { id: "kns-1", type: "KNS", code: "KNS", title: "Rèn luyện nét chữ nết người", description: "Rèn tính kiên nhẫn, cẩn thận." }
    ],
    equipment: {
      teacher: "Bảng con viết mẫu, một số vở thực hành viết sạch đẹp.",
      students: "Vở thực hành Tiếng Việt 5, bút mực tốt.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Kích hoạt tinh thần học tập vui tươi rèn nét chữ.",
        time: "5 - 7 phút",
        teacherActivity: "- Yêu cầu học sinh đọc nối tiếp đồng thanh khổ thơ/đoạn văn miêu tả gió dõng dạc.\n- Nhận xét khen ngợi.",
        studentActivity: "- Đứng dậy đọc dõng dạc, mạch lạc bài thơ với nhịp điệu rộn ràng chào tuần học mới tốt đẹp.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Nhận diện các lỗi chữ viết hoa thường gặp để phòng tránh sai sót.",
        time: "10 - 15 phút",
        teacherActivity: "- Viết mẫu chữ hoa cách điệu lên bảng con.\n- Chỉ ra lỗi HS thường viết lệch hàng hoặc khoảng cách quá xa giữa các con chữ.",
        studentActivity: "- Quan sát tỉ mỉ kĩ thuật đưa nét bút của giáo viên để khắc sâu quy trình viết đúng đẹp.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Thực hành viết nắn nót vở luyện viết chữ sạch sẽ.",
        time: "12 - 15 phút",
        teacherActivity: "- Cho học sinh thực hành viết vào vở luyện tập từ ứng dụng và câu ứng dụng.\n- Di chuyển quanh lớp giúp đỡ học sinh có tư thế ngồi chưa thẳng lưng hoặc cầm bút sai cách.",
        studentActivity: "- Tập trung cao độ viết nắn nót sạch đẹp từng nét chữ hoa đúng ô li.\n- Thực hiện ngồi thẳng lưng, mắt cách vở chuẩn cự li.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Triển lãm và biểu dương những trang viết đẹp nhất lớp.",
        time: "5 - 7 phút",
        teacherActivity: "- Chọn và trình chiếu 3-4 bài viết xuất sắc nhất lớp lên tivi để cả lớp học tập và cổ vũ tinh thần cố gắng.",
        studentActivity: "- Chăm chú chiêm ngưỡng nét chữ thanh tú của bạn học để hoàn thiện chữ viết của mình tốt hơn.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
];

// Sample Preloaded Lesson Plans for Grade 2 Week 1 & 2
export const defaultGrade2Week1Plans: LessonPlan[] = [
  {
    id: "khbd-g2-w1-hdtn1",
    grade: 2,
    subject: "Hoạt động trải nghiệm",
    topic: "Chủ đề 1: Khám phá bản thân",
    lessonTitle: "Sinh hoạt dưới cờ: THAM GIA LỄ KHAI GIẢNG NĂM HỌC MỚI",
    period: "Tiết 1 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 1,
    teacherName: "Nguyễn Thị Kim Ngọc",
    className: "2A",
    objectives: {
      specificCompetencies: [
        "Quyền và nghĩa vụ học tập: Em có quyền và nghĩa vụ tham gia các hoạt động học tập, rèn luyện do nhà trường tổ chức.",
      ],
      generalCompetencies: [
        "Năng lực tự chủ, thích ứng với môi trường lớp 2.",
        "Giao tiếp thân thiện với bạn bè và thầy cô.",
      ],
      qualities: [
        "Nhân ái, trách nhiệm, yêu quý bạn bè và trường lớp.",
      ],
    },
    integratedContent: "Tích hợp Quyền trẻ em: Quyền và nghĩa vụ học tập và rèn luyện tập thể.",
    integrationTags: [
      { id: "qcn-1", type: "QCN", code: "QCN", title: "Quyền học tập & rèn luyện", description: "Tham gia các hoạt động giáo dục." }
    ],
    equipment: {
      teacher: "Loa đài, cờ hoa, khẩu hiệu khai giảng.",
      students: "Cờ hoa cầm tay, trang phục chỉnh tề.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Tạo không khí rộn rã đầu năm học.",
        time: "5 - 7 phút",
        teacherActivity: "- Bắt nhịp bài hát 'Ngày đầu tiên đi học'.\n- Nhắc nhở HS ổn định hàng ngũ.",
        studentActivity: "- Hát vang bài hát và chỉnh đốn hàng ngũ thẳng hàng.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Tham gia nghi thức chào cờ và nghe thư chúc mừng.",
        time: "10 - 15 phút",
        teacherActivity: "- Điều hành chào cờ trang trọng.\n- Giới thiệu ý nghĩa ngày khai giảng.",
        studentActivity: "- Đứng nghiêm chào cờ và lắng nghe thầy cô phát biểu.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Giao lưu và chúc mừng năm học mới.",
        time: "12 - 15 phút",
        teacherActivity: "- Tổ chức trò chơi tặng lời chúc mừng năm học mới cho bạn bên cạnh.",
        studentActivity: "- Quay sang bạn trao lời chúc vui vẻ, lễ phép cảm ơn.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Cam kết thực hiện tốt nội quy lớp 2.",
        time: "5 - 7 phút",
        teacherActivity: "- Phát động phong trào thi đua 'Hoa điểm 10'.",
        studentActivity: "- Hào hứng hưởng ứng và xếp hàng vào lớp ngăn nắp.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g2-w1-tv1",
    grade: 2,
    subject: "Tiếng Việt 2 (Đọc)",
    topic: "Chủ điểm 1: Em lớn lên từng ngày",
    lessonTitle: "Bài 1: TÔI LÀ HỌC SINH LỚP 2 (TIẾT 1)",
    period: "Tiết 2 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 2,
    teacherName: "Nguyễn Thị Kim Ngọc",
    className: "2A",
    objectives: {
      specificCompetencies: [
        "Đọc đúng, rõ ràng bài đọc 'Tôi là học sinh lớp 2'; biết ngắt nghỉ hơi sau các dấu câu; hiểu nội dung bài: niềm vui và sự tự hào khi trở thành học sinh lớp 2.",
      ],
      generalCompetencies: [
        "Tự chủ tự học trong luyện đọc; giao tiếp tự tin khi bày tỏ cảm xúc.",
      ],
      qualities: [
        "Chăm chỉ học tập, yêu quý bạn bè và mái trường.",
      ],
    },
    integratedContent: "Tích hợp KNS: Trò chơi giao tiếp, nói lời chào thân thiện trong năm học mới.",
    integrationTags: [
      { id: "kns-1", type: "KNS", code: "KNS", title: "Kĩ năng chào hỏi thân thiện", description: "Thực hành nói lời chào và chúc bạn vui vẻ." }
    ],
    equipment: {
      teacher: "SGK Tiếng Việt 2, tranh minh họa bạn nhỏ đi học.",
      students: "SGK Tiếng Việt 2, vở ghi.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Gợi mở cảm xúc bước vào lớp 2.",
        time: "5 - 7 phút",
        teacherActivity: "- Hỏi: 'Hôm nay ngày đầu lên lớp 2, em cảm thấy như thế nào?'",
        studentActivity: "- Hào hứng trả lời: Em thấy mình lớn hơn, vui vẻ gặp lại bạn bè.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Luyện đọc đúng toàn bài.",
        time: "10 - 15 phút",
        teacherActivity: "- Đọc mẫu bài văn với giọng vui tươi, tự hào.\n- Hướng dẫn luyện đọc câu dài, từ khó: 'ngỡ ngàng', 'chững chạc', 'rộn rã'.",
        studentActivity: "- Theo dõi SGK, đọc thầm theo cô.\n- Luyện đọc từ khó và câu dài theo nhóm đôi.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Đọc hiểu và trả lời câu hỏi bài học.",
        time: "12 - 15 phút",
        teacherActivity: "- Hướng dẫn HS trả lời câu hỏi 1, 2 trong SGK.\n- Tích hợp KNS: Cho HS thực hành trò chơi 'Tặng lời chúc cho bạn'.",
        studentActivity: "- Đọc thầm đoạn 1, 2 và trả lời câu hỏi.\n- Thực hành chúc bạn một năm học mới nhiều điểm tốt.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Khắc sâu tinh thần tự hào là học sinh lớp 2.",
        time: "5 - 7 phút",
        teacherActivity: "- Nhận xét tiết học, dặn dò về nhà đọc lại bài cho ông bà, bố mẹ nghe.",
        studentActivity: "- Lắng nghe và ghi nhớ nhiệm vụ.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
  {
    id: "khbd-g2-w1-toan1",
    grade: 2,
    subject: "Toán 2",
    topic: "Chủ đề 1: Ôn tập và bổ sung",
    lessonTitle: "Bài 1: ÔN TẬP CÁC SỐ ĐẾN 100 (TIẾT 1)",
    period: "Tiết 4 (Tiết PPCT 1)",
    ppctNumber: 1,
    week: 1,
    dayOfWeek: "Thứ Hai",
    session: "Sáng",
    periodInDay: 4,
    teacherName: "Nguyễn Thị Kim Ngọc",
    className: "2A",
    objectives: {
      specificCompetencies: [
        "Củng cố cách đọc, viết, đếm các số trong phạm vi 100; nhận biết số chục, số đơn vị.",
      ],
      generalCompetencies: [
        "Năng lực tư duy và lập luận toán học; giao tiếp toán học.",
      ],
      qualities: [
        "Cẩn thận, chăm chỉ, hứng thú với môn Toán.",
      ],
    },
    integratedContent: "Tích hợp học thông qua chơi (Bộ phận): Củng cố đọc, viết và so sánh số tự nhiên; Tích hợp NLS 1.3.CB1a.",
    integrationTags: [
      { id: "htqc-1", type: "HTQC", code: "HTQC", title: "Học thông qua chơi", description: "Trò chơi tìm số còn thiếu." },
      { id: "nls-1-1", type: "NLS", code: "NLS 1.3.CB1a", title: "Nhận biết cấu trúc bảng số", description: "Quan sát bảng số trên màn hình." }
    ],
    equipment: {
      teacher: "Bảng các số từ 1 đến 100, thẻ số.",
      students: "Bảng con, phấn, SGK Toán 2.",
    },
    activities: [
      {
        step: 1,
        title: "1. Khởi động",
        objective: "Khởi động trò chơi đếm số nhanh.",
        time: "5 - 7 phút",
        teacherActivity: "- Tổ chức trò chơi 'Bắn tên đếm số': Đếm xuôi từ 1 đến 20, đếm cách 5 từ 5 đến 50.",
        studentActivity: "- Cả lớp tham gia sôi nổi, phản xạ nhanh.",
      },
      {
        step: 2,
        title: "2. Khám phá",
        objective: "Ôn lại bảng số từ 1 đến 100.",
        time: "10 - 15 phút",
        teacherActivity: "- Chiếu bảng các số từ 1 đến 100 lên tivi.\n- Hỏi về cấu tạo số: Số 45 gồm mấy chục và mấy đơn vị?",
        studentActivity: "- Quan sát bảng số, trả lời: Số 45 gồm 4 chục và 5 đơn vị.",
      },
      {
        step: 3,
        title: "3. Luyện tập",
        objective: "Làm các bài tập 1, 2, 3 trong SGK.",
        time: "12 - 15 phút",
        teacherActivity: "- Giao bài tập điền số còn thiếu vào ô trống.\n- Hướng dẫn HS làm bài vào vở.",
        studentActivity: "- Hoàn thành bài tập cá nhân vào vở, đổi vở kiểm tra bạn bên cạnh.",
      },
      {
        step: 4,
        title: "4. Vận dụng",
        objective: "Vận dụng đếm số lượng đồ dùng trong lớp.",
        time: "5 - 7 phút",
        teacherActivity: "- Yêu cầu HS đếm số bàn ghế, số bóng đèn trong lớp học.",
        studentActivity: "- Thực hành đếm nhanh và báo cáo kết quả chính xác.",
      },
    ],
    adjustment: "........................................................................................................................",
  },
];

export const sampleLessonPlans: LessonPlan[] = [
  ...defaultGrade2Week1Plans,
  ...defaultGrade5Week1Plans,
];

