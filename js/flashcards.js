/**
 * AWS Certified AI Practitioner (AIF-C01) - Flashcards Bank
 * 35+ thẻ ghi nhớ thuật ngữ cốt lõi hay ra thi nhất
 */

const FLASHCARDS_DATA = [
  {
    id: "fc-1",
    domainId: 1,
    term: "Supervised Learning",
    termVi: "Học có giám sát",
    definition: "Thuật toán học từ dữ liệu ĐÃ CÓ NHÃN (Labeled data). Gồm 2 bài toán chính: Classification (dự đoán nhãn rời rạc: Spam / Not Spam) và Regression (dự đoán số liên tục: Giá nhà, nhiệt độ).",
    examKeyword: "Labeled data, Classification, Regression",
    category: "ML Core"
  },
  {
    id: "fc-2",
    domainId: 1,
    term: "Unsupervised Learning",
    termVi: "Học không giám sát",
    definition: "Thuật toán học từ dữ liệu KHÔNG CÓ NHÃN (Unlabeled data). Tìm cấu trúc tiềm ẩn, gom nhóm (Clustering - ví dụ K-Means) hoặc phát hiện bất thường (Anomaly detection).",
    examKeyword: "Unlabeled data, Clustering, Customer segmentation",
    category: "ML Core"
  },
  {
    id: "fc-3",
    domainId: 1,
    term: "Reinforcement Learning (RL)",
    termVi: "Học tăng cường",
    definition: "Agent tương tác với môi trường thông qua Thử và Sai (Trial & Error). Nhận Điểm thưởng (Reward) khi đúng và Điểm phạt (Penalty) khi sai. Đại diện AWS: AWS DeepRacer.",
    examKeyword: "Trial and error, Reward/Penalty, AWS DeepRacer",
    category: "ML Core"
  },
  {
    id: "fc-4",
    domainId: 1,
    term: "Overfitting vs Underfitting",
    termVi: "Quá khớp vs Chưa khớp",
    definition: "• Overfitting: Học vẹt, train tốt test kém &rarr; Khắc phục: Thêm data, Regularization (L1/L2), Dropout.\n• Underfitting: Mô hình quá đơn giản, train lẫn test đều kém &rarr; Khắc phục: Tăng độ phức tạp mô hình, thêm features.",
    examKeyword: "High train accuracy + low test accuracy = Overfitting",
    category: "ML Core"
  },
  {
    id: "fc-5",
    domainId: 1,
    term: "Precision vs Recall",
    termVi: "Độ chuẩn xác vs Độ nhạy",
    definition: "• Precision = TP / (TP + FP): Đoán Dương thì bao nhiêu % đúng. Cần khi chi phí báo động giả rất cao (Spam filter).\n• Recall = TP / (TP + FN): Bắt được bao nhiêu % trong các ca thực sự Dương. Cần khi KHÔNG ĐƯỢC BỎ SÓT (Bệnh hiểm nghèo, gian lận thẻ tín dụng).",
    examKeyword: "Spam filter &rarr; Precision. Cancer / Fraud detection &rarr; Recall",
    category: "Evaluation"
  },
  {
    id: "fc-6",
    domainId: 1,
    term: "Amazon Rekognition",
    termVi: "Dịch vụ thị giác máy tính",
    definition: "Dịch vụ thị giác máy tính đã huấn luyện sẵn: Phân tích ảnh/video, nhận diện khuôn mặt, so sánh khuôn mặt (CompareFaces), đếm người, kiểm duyệt nội dung phản cảm (Content moderation).",
    examKeyword: "Facial analysis, compare selfie with ID, content moderation",
    category: "AWS AI Services"
  },
  {
    id: "fc-7",
    domainId: 1,
    term: "Amazon Textract",
    termVi: "OCR thông minh cho văn bản",
    definition: "OCR thông minh trích xuất văn bản, bảng biểu (Tables) và các cặp khóa-giá trị (Forms/Key-value pairs) từ tài liệu scan và file PDF mà không cần tự train model.",
    examKeyword: "Extract tables and forms from scanned PDFs / invoices",
    category: "AWS AI Services"
  },
  {
    id: "fc-8",
    domainId: 1,
    term: "Amazon Transcribe vs Polly",
    termVi: "Bộ đôi âm thanh giọng nói",
    definition: "• Transcribe: Chuyển Giọng nói &rarr; Chữ viết (Speech-to-Text - ASR), dùng tạo phụ đề, phân tích cuộc gọi tổng đài.\n• Polly: Chuyển Chữ viết &rarr; Giọng nói sống động (Text-to-Speech - TTS) với nhiều ngôn ngữ và chất giọng.",
    examKeyword: "Voice to text = Transcribe. Text to voice = Polly",
    category: "AWS AI Services"
  },
  {
    id: "fc-9",
    domainId: 1,
    term: "Amazon Comprehend",
    termVi: "Phân tích ngôn ngữ tự nhiên (NLP)",
    definition: "Dịch vụ NLP phân tích văn bản: Đánh giá cảm xúc (Sentiment: Positive, Negative), trích xuất thực thể (Entities), phát hiện thông tin định danh cá nhân nhạy cảm (PII).",
    examKeyword: "Sentiment analysis, entity recognition, PII redaction",
    category: "AWS AI Services"
  },
  {
    id: "fc-10",
    domainId: 1,
    term: "Amazon Kendra",
    termVi: "Tìm kiếm thông minh cấp doanh nghiệp",
    definition: "Công cụ tìm kiếm thông minh cấp doanh nghiệp dùng Machine Learning. Cho phép nhân viên đặt câu hỏi bằng ngôn ngữ tự nhiên và tìm kiếm xuyên suốt qua S3, SharePoint, Confluence, Salesforce.",
    examKeyword: "Intelligent enterprise search across S3 & SharePoint",
    category: "AWS AI Services"
  },
  {
    id: "fc-11",
    domainId: 2,
    term: "Transformer & Self-Attention",
    termVi: "Kiến trúc nền móng của LLM",
    definition: "Cơ chế tính toán trọng số mối quan hệ giữa mọi từ trong câu cùng một lúc. Cho phép xử lý song song trên quy mô lớn, vượt trội so với xử lý tuần tự của mạng RNN cũ.",
    examKeyword: "Parallel processing, Self-Attention mechanism",
    category: "GenAI Foundations"
  },
  {
    id: "fc-12",
    domainId: 2,
    term: "Tokens & Context Window",
    termVi: "Đơn vị xử lý & Cửa sổ ngữ cảnh",
    definition: "• 1 Token ~ 0.75 từ tiếng Anh (~4 ký tự). 100 Tokens ~ 75 từ.\n• Context Window: Giới hạn tổng số token tối đa (Prompt + Output) mà mô hình nhớ được trong một phiên làm việc.",
    examKeyword: "1 token ~ 0.75 words, Context Window limit",
    category: "GenAI Foundations"
  },
  {
    id: "fc-13",
    domainId: 2,
    term: "Vector Embeddings",
    termVi: "Biểu diễn ngữ nghĩa bằng số học",
    definition: "Chuyển văn bản thành các dãy số (vector) trong không gian nhiều chiều. Các từ/câu có nghĩa tương đồng sẽ nằm gần nhau về mặt hình học (đo bằng Cosine Similarity).",
    examKeyword: "High-dimensional numerical representation, semantic similarity",
    category: "GenAI Foundations"
  },
  {
    id: "fc-14",
    domainId: 2,
    term: "Temperature (Nhiệt độ)",
    termVi: "Tham số kiểm soát tính sáng tạo",
    definition: "• Temp = 0.0: Xác định (Deterministic), ít ngẫu nhiên, logic, chính xác &rarr; Viết code, giải toán, tra cứu sự thật.\n• Temp cao (0.8 - 1.0+): Sáng tạo, ngẫu hứng, từ ngữ phong phú &rarr; Viết truyện, marketing, làm thơ.",
    examKeyword: "Deterministic code = Low Temp. Creative writing = High Temp",
    category: "Hyperparameters"
  },
  {
    id: "fc-15",
    domainId: 2,
    term: "Top-P (Nucleus Sampling)",
    termVi: "Lấy mẫu xác suất tích lũy",
    definition: "Giới hạn chọn token trong tập các từ có TỔNG XÁC SUẤT TÍCH LŨY đạt đến ngưỡng P (ví dụ 0.9 = top 90% từ có xác suất cao nhất). Giúp loại bỏ các từ kỳ dị, tăng độ tự nhiên.",
    examKeyword: "Cumulative probability threshold",
    category: "Hyperparameters"
  },
  {
    id: "fc-16",
    domainId: 2,
    term: "Top-K",
    termVi: "Giới hạn số lượng từ ứng viên",
    definition: "Chỉ chọn ngẫu nhiên trong đúng K từ có xác suất cao nhất. Nếu K=1 tương đương với Greedy Search (chỉ chọn từ có xác suất cao nhất duy nhất).",
    examKeyword: "Select from top K most probable tokens",
    category: "Hyperparameters"
  },
  {
    id: "fc-17",
    domainId: 2,
    term: "Hallucination (Ảo giác AI)",
    termVi: "Mô hình bịa đặt thông tin",
    definition: "Hiện tượng mô hình tự tin khẳng định những thông tin hoàn toàn sai sự thật hoặc bịa đặt. Khắc phục bằng: RAG (Bedrock Knowledge Bases) và Bedrock Guardrails (Contextual Grounding check).",
    examKeyword: "Fabricated facts presented with confidence &rarr; Mitigate by RAG",
    category: "GenAI Risks"
  },
  {
    id: "fc-18",
    domainId: 3,
    term: "RAG (Retrieval-Augmented Generation)",
    termVi: "Tạo sinh tăng cường truy xuất",
    definition: "Kỹ thuật kết nối mô hình nền tảng với dữ liệu nội bộ công ty (S3, Vector DB). Trích xuất thông tin liên quan trước rồi mới đưa vào prompt cho LLM trả lời. KHÔNG CẦN TRAIN LẠI MODEL.",
    examKeyword: "Company data, frequent updates, lowest cost, no retraining",
    category: "Foundation Models"
  },
  {
    id: "fc-19",
    domainId: 3,
    term: "Amazon Bedrock",
    termVi: "Dịch vụ GenAI Serverless hàng đầu",
    definition: "Dịch vụ Serverless cung cấp quyền truy cập các mô hình nền tảng hàng đầu (Claude, Titan, Llama, Stable Diffusion) qua một API duy nhất. Không quản lý máy chủ, trả tiền theo lượng token.",
    examKeyword: "Serverless foundation models API, zero infrastructure management",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-20",
    domainId: 3,
    term: "Bedrock Knowledge Bases",
    termVi: "Tự động hóa giải pháp RAG",
    definition: "Giải pháp RAG trọn gói: Đọc file từ S3, tự động chia nhỏ (Chunking), tạo embedding qua Titan Embeddings, lưu vào Vector DB (OpenSearch/Aurora), và tự động tra cứu khi user hỏi.",
    examKeyword: "Fully managed RAG pipeline with Amazon S3 and Vector DB",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-21",
    domainId: 3,
    term: "Bedrock Agents",
    termVi: "Tác tử AI tự động thực thi hành động",
    definition: "Tác tử tự động chia nhỏ tác vụ phức tạp thành nhiều bước và THỰC THI HÀNH ĐỘNG THỰC TẾ (gọi API, tra cứu database) bằng cách gọi các Action Groups (hàm AWS Lambda).",
    examKeyword: "Autonomous task orchestration, invoke AWS Lambda functions",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-22",
    domainId: 3,
    term: "Bedrock Guardrails",
    termVi: "Hàng rào an toàn cho GenAI",
    definition: "Cung cấp rào chắn bảo vệ: Chặn chủ đề cấm (Denied Topics), lọc từ ngữ thô tục, che/lọc PII, và tính năng Contextual Grounding Check để ngăn chặn ảo giác (Hallucination).",
    examKeyword: "Block harmful topics, mask PII, contextual grounding check",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-23",
    domainId: 3,
    term: "Few-shot Prompting",
    termVi: "Kỹ nghệ câu lệnh kèm ví dụ mẫu",
    definition: "Cung cấp một vài (few) ví dụ minh họa (input-output) trong prompt trước khi đưa ra câu hỏi chính để mô hình hiểu phong cách và cấu trúc trả lời.",
    examKeyword: "Provide input-output examples in prompt",
    category: "Prompt Engineering"
  },
  {
    id: "fc-24",
    domainId: 3,
    term: "Chain-of-Thought (CoT)",
    termVi: "Chuỗi suy nghĩ từng bước",
    definition: "Hướng dẫn mô hình suy nghĩ từng bước một ('Let's think step by step') trước khi đưa ra kết luận. Cực kỳ hiệu quả cho các bài toán logic hoặc tính toán phức tạp.",
    examKeyword: "Think step-by-step, complex reasoning",
    category: "Prompt Engineering"
  },
  {
    id: "fc-25",
    domainId: 3,
    term: "AWS Trainium vs Inferentia",
    termVi: "Bộ đôi chip silicon chuyên dụng của AWS",
    definition: "• AWS Trainium: Chip chuyên biệt cho HUẤN LUYỆN (Training) mô hình ML với chi phí tối ưu nhất.\n• AWS Inferentia: Chip chuyên biệt cho SUY LUẬN (Inference) với độ trễ thấp và chi phí rẻ nhất.",
    examKeyword: "Trainium = Training. Inferentia = Low-latency Inference",
    category: "AWS Silicon"
  },
  {
    id: "fc-26",
    domainId: 3,
    term: "Amazon SageMaker JumpStart",
    termVi: "Hub mô hình mã nguồn mở",
    definition: "Trung tâm trong SageMaker cung cấp hàng trăm mô hình mã nguồn mở huấn luyện sẵn (từ Hugging Face, Meta...) sẵn sàng triển khai hoặc fine-tune chỉ với 1 cú click chuột.",
    examKeyword: "ML Hub, pre-trained open source models, 1-click deployment",
    category: "Amazon SageMaker"
  },
  {
    id: "fc-27",
    domainId: 3,
    term: "PEFT / LoRA",
    termVi: "Tinh chỉnh mô hình tiết kiệm tham số",
    definition: "Parameter-Efficient Fine-Tuning: Đóng băng hầu hết trọng số của mô hình gốc và chỉ cập nhật một phần cực nhỏ (<1%) tham số bổ sung. Giúp tiết kiệm 80-90% chi phí tính toán GPU.",
    examKeyword: "Fine-tune tiny fraction of parameters, reduce GPU memory",
    category: "Fine-Tuning"
  },
  {
    id: "fc-28",
    domainId: 4,
    term: "Amazon SageMaker Clarify",
    termVi: "Phát hiện định kiến & Giải thích mô hình",
    definition: "Công cụ kiểm tra tính công bằng (Fairness) bằng cách phát hiện bias trong dữ liệu trước/sau train, và cung cấp tính năng giải thích mô hình (Explainability) bằng SHAP values.",
    examKeyword: "Detect bias, explainability, SHAP values",
    category: "Responsible AI"
  },
  {
    id: "fc-29",
    domainId: 4,
    term: "AWS AI Service Cards",
    termVi: "Thẻ tài liệu minh bạch dịch vụ AI",
    definition: "Tài liệu công khai chính thức của AWS cung cấp thông tin minh bạch (Transparency) về mục đích thiết kế, các tình huống sử dụng phù hợp và giới hạn kỹ thuật của các dịch vụ AI.",
    examKeyword: "Transparency documentation, intended use cases, limitations",
    category: "Responsible AI"
  },
  {
    id: "fc-30",
    domainId: 4,
    term: "Amazon Augmented AI (A2I)",
    termVi: "Quy trình con người can thiệp (HITL)",
    definition: "Dịch vụ Human-in-the-loop cung cấp quy trình chuyển giao các dự đoán ML có độ tin cậy thấp (Low confidence score) cho người thật thẩm định lại (tích hợp Textract, Rekognition).",
    examKeyword: "Human review for low-confidence ML predictions, Human-in-the-loop",
    category: "Responsible AI"
  },
  {
    id: "fc-31",
    domainId: 4,
    term: "SageMaker Model Cards",
    termVi: "Hồ sơ quản trị thông tin mô hình",
    definition: "Nơi lưu trữ siêu dữ liệu mô hình tập trung: Mục đích sử dụng, các giả định, chỉ số đánh giá hiệu năng và thông tin quản trị để phục vụ tuân thủ và giải trình.",
    examKeyword: "Document model metadata, intended usage, governance records",
    category: "Responsible AI"
  },
  {
    id: "fc-32",
    domainId: 5,
    term: "Bedrock Data Privacy Guarantee",
    termVi: "Cam kết bảo mật dữ liệu của Bedrock",
    definition: "AWS KHÔNG BAO GIỜ sử dụng prompt, câu trả lời hoặc dữ liệu của khách hàng đưa lên Bedrock để huấn luyện hay cải thiện mô hình gốc của Amazon hoặc bất kỳ bên thứ ba nào.",
    examKeyword: "AWS NEVER uses customer data/prompts to train base models",
    category: "Security"
  },
  {
    id: "fc-33",
    domainId: 5,
    term: "VPC Endpoints (AWS PrivateLink)",
    termVi: "Kết nối mạng an toàn không qua Internet",
    definition: "Cho phép các tài nguyên trong VPC riêng kết nối trực tiếp đến Amazon Bedrock hoặc S3 qua mạng nội bộ AWS, TUYỆT ĐỐI KHÔNG ĐI QUA INTERNET CÔNG CỘNG.",
    examKeyword: "Access Bedrock without traversing public internet, PrivateLink",
    category: "Security"
  },
  {
    id: "fc-34",
    domainId: 5,
    term: "AWS CloudTrail vs CloudWatch",
    termVi: "Nhật ký kiểm toán vs Giám sát chỉ số",
    definition: "• CloudTrail: Ghi lại LỊCH SỬ GỌI API (Ai gọi, gọi API nào, khi nào, IP nào) &rarr; Kiểm toán tuân thủ (Audit).\n• CloudWatch: Giám sát CHỈ SỐ VẬN HÀNH (Số request, token usage, độ trễ) và tạo CẢNH BÁO (Alarms).",
    examKeyword: "API audit history = CloudTrail. Operational metrics & alarms = CloudWatch",
    category: "Governance"
  },
  {
    id: "fc-35",
    domainId: 5,
    term: "AWS Artifact",
    termVi: "Cổng tải báo cáo tuân thủ bảo mật",
    definition: "Cổng thông tin tự phục vụ miễn phí để tải về các báo cáo kiểm toán bảo mật chính thức của AWS (SOC 1/2/3, ISO 27001, PCI-DSS, HIPAA) để nộp cho kiểm toán viên.",
    examKeyword: "Download SOC/ISO compliance reports (Phân biệt với CodeArtifact)",
    category: "Compliance"
  }
];

