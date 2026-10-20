/**
 * AWS Certified AI Practitioner (AIF-C01) - Cheat Sheet & Quick Reference
 * Bảng tra cứu AIF-C01. Mẹo học tập là gợi ý, không bảo đảm điểm thi.
 */

const CHEATSHEET_DATA = {
  serviceMatrix: [
    { service: "Amazon Rekognition", purpose: "Phân tích ảnh & video, nhận diện khuôn mặt, so sánh mặt eKYC, kiểm duyệt nội dung", keywords: "Facial analysis, compare selfie with passport, object detection, content moderation" },
    { service: "Amazon Textract", purpose: "OCR thông minh đọc hiểu bảng biểu (tables), form mẫu từ PDF scan và hóa đơn", keywords: "Extract tables & key-value pairs from scanned PDFs / invoices" },
    { service: "Amazon Transcribe", purpose: "Chuyển giọng nói thành văn bản (Speech-to-Text - ASR), phụ đề, phân tích cuộc gọi", keywords: "Audio to text transcripts, call center voice recordings" },
    { service: "Amazon Polly", purpose: "Chuyển văn bản thành giọng đọc tự nhiên (Text-to-Speech - TTS) với thẻ SSML", keywords: "Text to lifelike voice, read aloud articles, SSML tags" },
    { service: "Amazon Comprehend", purpose: "Phân tích cảm xúc, trích xuất thực thể, phát hiện và che giấu PII nhạy cảm", keywords: "Sentiment analysis, entity recognition, PII detection / redaction" },
    { service: "Amazon Translate", purpose: "Dịch thuật thần kinh đa ngôn ngữ thời gian thực độ chính xác cao", keywords: "Neural machine translation between languages in real-time" },
    { service: "Amazon Lex", purpose: "Xây dựng Chatbot và Voicebot đàm thoại tự nhiên (như trợ lý Alexa)", keywords: "Conversational AI chatbot, Intent, Slot, voice interface" },
    { service: "Amazon Kendra", purpose: "Tìm kiếm thông minh cấp doanh nghiệp dùng ngôn ngữ tự nhiên xuyên suốt S3, SharePoint", keywords: "Intelligent enterprise search across S3, SharePoint, Confluence" },
    { service: "Amazon Bedrock", purpose: "Dịch vụ được quản lý để truy cập foundation models và xây ứng dụng GenAI; giá/triển khai tùy model, tính năng và lựa chọn inference.", keywords: "Managed foundation models, model access, inference options, model-dependent pricing" },
    { service: "Bedrock Knowledge Bases", purpose: "Hỗ trợ workflow RAG với nguồn dữ liệu và vector store được hỗ trợ; cần cấu hình ingestion/sync và retrieval phù hợp.", keywords: "Managed RAG workflow, data source ingestion/sync, retrieval" },
    { service: "Bedrock Agents", purpose: "Agent điều phối tác vụ và gọi action groups đã cấu hình; Lambda là một tùy chọn thực thi.", keywords: "Orchestration, action groups, configured tools" },
    { service: "Bedrock Guardrails", purpose: "Cấu hình các kiểm soát nội dung, thông tin nhạy cảm và grounding được hỗ trợ; không bảo đảm loại bỏ mọi rủi ro.", keywords: "Denied topics, content filters, sensitive information, grounding checks" },
    { service: "SageMaker Studio", purpose: "IDE trên Cloud hoàn chỉnh cho Data Scientist phát triển ML end-to-end", keywords: "Complete ML IDE, notebooks, custom training" },
    { service: "SageMaker Canvas", purpose: "Xây dựng mô hình ML bằng giao diện kéo thả trực quan No-Code cho Business Analysts", keywords: "Visual point-and-click, business analysts, no code ML" },
    { service: "SageMaker JumpStart", purpose: "Hub mô hình mã nguồn mở huấn luyện sẵn 1-click deploy (Hugging Face, Meta)", keywords: "ML Hub, open-source models, pre-trained Hugging Face / Meta" },
    { service: "SageMaker Clarify", purpose: "Phát hiện định kiến (bias) và giải thích mô hình bằng chỉ số SHAP values", keywords: "Detect bias, explainability, interpretability, SHAP values" },
    { service: "SageMaker Model Monitor", purpose: "Theo dõi chất lượng dữ liệu/mô hình theo các baseline, metric và monitor đã cấu hình; phạm vi phụ thuộc workload.", keywords: "Monitor configured data/model quality signals" },
    { service: "Amazon Augmented AI (A2I)", purpose: "Hỗ trợ human review cho một số workflow và tích hợp được hỗ trợ, theo điều kiện/cấu hình review.", keywords: "Human review, supported ML workflows, configured thresholds" },
    { service: "AWS Trainium", purpose: "Accelerator AWS hướng tới workload huấn luyện ML; lợi ích cần đánh giá theo model, phần mềm và workload.", keywords: "ML training accelerator, workload-dependent performance" },
    { service: "AWS Inferentia", purpose: "Accelerator AWS hướng tới workload inference; hiệu năng/chi phí phụ thuộc model và cấu hình.", keywords: "Inference accelerator, workload-dependent performance" }
  ],

  hyperparameters: [
    { name: "Temperature = 0.0", behavior: "Temperature thấp thường giảm biến thiên sampling; không bảo đảm tính xác định hoặc sự thật. Hỗ trợ và tác động tùy model/API.", bestFor: "Khi muốn đầu ra ít biến thiên hơn, nếu model/API hỗ trợ" },
    { name: "Temperature = 0.7 - 1.0+", behavior: "Temperature cao thường tăng biến thiên trong sampling; kết quả vẫn phụ thuộc model, prompt và cấu hình khác.", bestFor: "Thử nghiệm khi cần nhiều phương án diễn đạt; đánh giá chất lượng trước khi dùng" },
    { name: "Top-P (Nucleus Sampling)", behavior: "Lấy mẫu từ tập token nhỏ nhất có xác suất tích lũy đạt ngưỡng P; P=0.9 không có nghĩa là 90% số từ.", bestFor: "Điều chỉnh độ đa dạng theo tài liệu model; tránh khái quát một con số cho mọi API" },
    { name: "Top-K", behavior: "Sampling giới hạn ứng viên vào tối đa K token có xác suất cao nhất; Top-K=1 tương đương chọn token cao nhất chỉ trong cấu hình sampling phù hợp.", bestFor: "Kiểm tra cách provider/model kết hợp Top-K với Temperature và Top-P" },
    { name: "Stop Sequences", behavior: "Chuỗi được cấu hình để kết thúc generation khi model sinh ra chuỗi đó; hỗ trợ và cách so khớp tùy API.", bestFor: "Dừng đầu ra tại delimiter/marker đã định nghĩa, nếu model/API hỗ trợ" }
  ],

  customizationSpectrum: [
    { level: "1. Prompt Engineering", effort: "Tối thiểu", cost: "Thấp nhất", when: "Khi mô hình gốc đã có sẵn khả năng nhưng cần hướng dẫn định dạng/văn phong (Zero-shot, Few-shot, Chain-of-Thought)" },
    { level: "2. RAG (Bedrock Knowledge Bases)", effort: "Trung bình", cost: "Tối ưu nhất cho doanh nghiệp", when: "Khi muốn mô hình trả lời dựa trên tài liệu nội bộ công ty luôn thay đổi liên tục, KHÔNG CẦN RETRAIN" },
    { level: "3. Fine-Tuning (PEFT / LoRA)", effort: "Nhiều", cost: "Cao", when: "Khi cần mô hình làm chủ thuật ngữ chuyên sâu (y khoa, tài chính) và đã có tập dữ liệu gán nhãn lớn" },
    { level: "4. Pre-training from Scratch", effort: "Cực kỳ lớn", cost: "Hàng triệu USD", when: "Cực kỳ hiếm dùng (chỉ các tập đoàn công nghệ lớn xây dựng LLM mới)" }
  ],

  goldenExamTips: [
    { icon: "shield-check", tag: "Bảo mật dữ liệu", title: "Quyền riêng tư trên Amazon Bedrock", desc: "<ul><li>Inputs/outputs không được dùng để huấn luyện foundation model gốc nếu khách hàng không đồng ý.</li><li>Dữ liệu cung cấp để customization được dùng cho mục đích customization đó; không gộp với dữ liệu nền tảng gốc.</li><li>Phân biệt dữ liệu gọi model với dữ liệu bạn chủ động cấp làm training data.</li></ul>", source: "AWS Bedrock privacy" },
    { icon: "workflow", tag: "Chọn giải pháp", title: "Bắt đầu từ yêu cầu nghiệp vụ", desc: "<ul><li>Xác định use case, chất lượng, latency, throughput, chi phí và yêu cầu compliance.</li><li>So sánh dịch vụ managed với phương án tự vận hành theo các ràng buộc đó.</li><li>Managed/serverless có thể giảm công vận hành, nhưng không mặc định là lựa chọn phù hợp nhất.</li></ul>", source: "Cách suy luận trong bài thi" },
    { icon: "scan-search", tag: "Từ khóa tình huống", title: "Ghép nhu cầu với dịch vụ", desc: "<ul><li>Tài liệu thay đổi, cần câu trả lời có ngữ cảnh → cân nhắc RAG/Knowledge Bases; cập nhật nguồn cần ingest/sync.</li><li>Kết nối riêng tới dịch vụ được hỗ trợ → VPC endpoint/PrivateLink phù hợp kiến trúc.</li><li>Audit hoạt động API → CloudTrail; metrics/alarms → CloudWatch.</li><li>A2I chỉ dùng cho workflow/dịch vụ được hỗ trợ và theo cấu hình review.</li></ul>", source: "Đọc toàn bộ yêu cầu trước khi chọn" },
    { icon: "network", tag: "Dịch vụ dễ nhầm", title: "Nhớ cặp khái niệm", desc: "<ul><li>Artifact: tài liệu/báo cáo compliance AWS; CodeArtifact: kho package phần mềm.</li><li>Trainium: accelerator hướng đến training; Inferentia: accelerator hướng đến inference. Hiệu năng/chi phí tùy workload.</li><li>Transcribe: speech-to-text; Polly: text-to-speech.</li></ul>", source: "Phân biệt theo use case" },
    { icon: "timer", tag: "Quản lý thời gian", title: "Chia 90 phút linh hoạt", desc: "<ul><li>65 câu trong 90 phút tương đương khoảng 1 phút 23 giây mỗi câu.</li><li>Đánh dấu câu cần quay lại nếu nền tảng thi cho phép; giữ thời gian rà câu bỏ trống.</li><li>Unanswered được tính sai và không có penalty riêng cho việc đoán.</li></ul>", source: "Gợi ý cá nhân, không phải quy định AWS" },
    { icon: "book-check", tag: "Cách ôn hiệu quả", title: "Học từ lý do, không học mẹo đoán", desc: "<ul><li>Sau mỗi câu, giải thích vì sao đáp án phù hợp và vì sao lựa chọn khác không khớp yêu cầu.</li><li>Ghi lại chủ đề/domain còn yếu rồi ôn lại bằng Exam Guide.</li><li>Mock exam chỉ giúp luyện nhịp độ; không thể quy đổi thành điểm AWS hay bảo đảm kết quả thi.</li></ul>", source: "Kết hợp với Exam Guide chính thức" }
  ]
};
