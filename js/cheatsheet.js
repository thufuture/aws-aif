/**
 * AWS Certified AI Practitioner (AIF-C01) - Cheat Sheet & Quick Reference
 * Bảng tra cứu thần tốc trước giờ thi - Toàn bộ bí kíp 1000/1000 từ DevOps.vn
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
    { service: "Amazon Bedrock", purpose: "Nền tảng Serverless truy cập các Foundation Model hàng đầu qua API duy nhất", keywords: "Serverless FM API, Claude, Titan, Llama, pay-per-token" },
    { service: "Bedrock Knowledge Bases", purpose: "Tự động hóa toàn bộ quy trình RAG (S3 + Vector DB), tra cứu tài liệu không cần train lại", keywords: "Managed RAG, query private company docs without retraining" },
    { service: "Bedrock Agents", purpose: "Tác tử AI tự động lập kế hoạch và gọi AWS Lambda để thực thi hành động thực tế", keywords: "Autonomous tasks, Action Groups, invoke Lambda functions" },
    { service: "Bedrock Guardrails", purpose: "Lọc nội dung độc hại, che PII, kiểm tra chống ảo giác Contextual Grounding", keywords: "Safeguards, denied topics, mask PII, contextual grounding check" },
    { service: "SageMaker Studio", purpose: "IDE trên Cloud hoàn chỉnh cho Data Scientist phát triển ML end-to-end", keywords: "Complete ML IDE, notebooks, custom training" },
    { service: "SageMaker Canvas", purpose: "Xây dựng mô hình ML bằng giao diện kéo thả trực quan No-Code cho Business Analysts", keywords: "Visual point-and-click, business analysts, no code ML" },
    { service: "SageMaker JumpStart", purpose: "Hub mô hình mã nguồn mở huấn luyện sẵn 1-click deploy (Hugging Face, Meta)", keywords: "ML Hub, open-source models, pre-trained Hugging Face / Meta" },
    { service: "SageMaker Clarify", purpose: "Phát hiện định kiến (bias) và giải thích mô hình bằng chỉ số SHAP values", keywords: "Detect bias, explainability, interpretability, SHAP values" },
    { service: "SageMaker Model Monitor", purpose: "Theo dõi trôi dữ liệu (Data Drift) và trôi mô hình (Model Drift) trong production", keywords: "Detect concept drift and data drift in production" },
    { service: "Amazon Augmented AI (A2I)", purpose: "Quy trình con người thẩm định lại khi ML có điểm tin cậy thấp (HITL)", keywords: "Human review for low-confidence ML predictions, Human-in-the-loop" },
    { service: "AWS Trainium", purpose: "Chip silicon chuyên dụng tối ưu hiệu năng và chi phí HUẤN LUYỆN (Training)", keywords: "Custom silicon optimized for high-performance ML TRAINING" },
    { service: "AWS Inferentia", purpose: "Chip silicon chuyên dụng tối ưu chi phí & độ trễ SUY LUẬN (Inference)", keywords: "Custom silicon optimized for low-cost, low-latency INFERENCE" }
  ],

  hyperparameters: [
    { name: "Temperature = 0.0", behavior: "Xác định hoàn toàn (Deterministic), tập trung vào sự thật logic, ít ngẫu nhiên", bestFor: "Viết mã nguồn (Code), giải toán, trích xuất dữ liệu, hỏi đáp kỹ thuật chuẩn xác" },
    { name: "Temperature = 0.7 - 1.0+", behavior: "Sáng tạo, ngẫu hứng, từ ngữ phong phú, phong cách đa dạng", bestFor: "Viết truyện, làm thơ, slogan marketing, brainstorm ý tưởng mới" },
    { name: "Top-P (Nucleus Sampling)", behavior: "Giới hạn chọn từ trong nhóm có tổng xác suất tích lũy đạt ngưỡng P", bestFor: "Top-P = 0.9 loại bỏ 10% từ ngữ kỳ dị, giữ câu văn tự nhiên và mạch lạc" },
    { name: "Top-K", behavior: "Chỉ chọn ngẫu nhiên trong đúng K từ có xác suất cao nhất", bestFor: "Top-K = 1 tương đương với Greedy Search (chọn 1 từ xác suất cao nhất)" },
    { name: "Stop Sequences", behavior: "Ký tự tín hiệu yêu cầu LLM dừng sinh thêm nội dung ngay lập tức", bestFor: "Ngắt khi thấy ký tự xuống dòng (\\n\\n) hoặc từ 'END'" }
  ],

  customizationSpectrum: [
    { level: "1. Prompt Engineering", effort: "Tối thiểu", cost: "Thấp nhất", when: "Khi mô hình gốc đã có sẵn khả năng nhưng cần hướng dẫn định dạng/văn phong (Zero-shot, Few-shot, Chain-of-Thought)" },
    { level: "2. RAG (Bedrock Knowledge Bases)", effort: "Trung bình", cost: "Tối ưu nhất cho doanh nghiệp", when: "Khi muốn mô hình trả lời dựa trên tài liệu nội bộ công ty luôn thay đổi liên tục, KHÔNG CẦN RETRAIN" },
    { level: "3. Fine-Tuning (PEFT / LoRA)", effort: "Nhiều", cost: "Cao", when: "Khi cần mô hình làm chủ thuật ngữ chuyên sâu (y khoa, tài chính) và đã có tập dữ liệu gán nhãn lớn" },
    { level: "4. Pre-training from Scratch", effort: "Cực kỳ lớn", cost: "Hàng triệu USD", when: "Cực kỳ hiếm dùng (chỉ các tập đoàn công nghệ lớn xây dựng LLM mới)" }
  ],

  goldenExamTips: [
    { title: "1. Cam kết vàng về Data Privacy của Amazon Bedrock", desc: "AWS KHÔNG BAO GIỜ sử dụng dữ liệu khách hàng (Prompts, Completions, dữ liệu trong S3) để huấn luyện hoặc cải thiện các mô hình nền tảng gốc của AWS hoặc bên thứ ba. Nhớ chắc chắn điều này để không bao giờ bị đề bài đánh lừa!" },
    { title: "2. Tư duy Solutions Architect (Bí quyết DevOps.vn)", desc: "Đề thi AIF-C01 không hỏi code hay toán sâu, mà hỏi bạn: 'Dịch vụ nào giải quyết bài toán này rẻ nhất và ít tốn công vận hành nhất (Lowest operational overhead)?'. Luôn ưu tiên dịch vụ Fully Managed / Serverless (Bedrock, Rekognition, Textract) trước khi nghĩ đến tự dựng máy chủ EC2." },
    { title: "3. Phương pháp loại trừ từ khóa ràng buộc (Keywords)", desc: "• Thấy 'Frequent document updates / No retraining / Low cost' &rarr; Chọn RAG / Bedrock Knowledge Bases.<br>• Thấy 'Without traversing public internet' &rarr; Chọn VPC Endpoints (AWS PrivateLink).<br>• Thấy 'Audit who called API and when' &rarr; Chọn AWS CloudTrail.<br>• Thấy 'Human review for low-confidence ML' &rarr; Chọn Amazon Augmented AI (Amazon A2I)." },
    { title: "4. Bẫy phân biệt dịch vụ dễ nhầm lẫn", desc: "• Phân biệt AWS Artifact (Tải báo cáo kiểm toán tuân thủ SOC, ISO) vs AWS CodeArtifact (Kho lưu trữ thư viện code npm, maven).<br>• Phân biệt AWS Trainium (Tối ưu cho Training) vs AWS Inferentia (Tối ưu cho Inference).<br>• Phân biệt Amazon Transcribe (Giọng nói &rarr; Chữ) vs Amazon Polly (Chữ &rarr; Giọng nói)." },
    { title: "5. Chiến lược phân bổ thời gian 90 phút phòng thi", desc: "• Lượt 1 (40 phút): Làm nhanh 65 câu. Câu nào chắc chắn thì chọn ngay; câu nào phân vân thì chọn đáp án khả dĩ nhất và bấm GẮN CỜ (Flag for review).<br>• Lượt 2 (30 phút): Mở danh sách câu gắn cờ để phân tích sâu từ khóa và dùng phương pháp loại trừ.<br>• Lượt 3 (20 phút cuối): Rà soát lại một lượt toàn bộ 65 câu để đảm bảo không bỏ sót câu nào." },
    { title: "6. Luyện đề thi thử để đạt 1000/1000", desc: "Đừng chỉ nhìn xem câu đó đúng hay sai, mà hãy đọc kỹ giải thích: 'Tại sao đáp án này đúng' và 'Tại sao 3 đáp án kia sai'. Khi bạn hiểu được lý do 3 đáp án kia sai, bạn đã học được thêm 3 kiến thức mới cho các câu hỏi khác!" }
  ]
};
