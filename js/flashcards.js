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
    definition: "Agent thực hiện hành động trong môi trường, nhận phản hồi (reward) và điều chỉnh chính sách để tối đa hóa reward tích lũy theo thời gian. Reward không đồng nghĩa với điểm phạt cố định; DeepRacer chỉ là một ví dụ minh họa của AWS.",
    examKeyword: "Agent, environment, actions, reward, policy",
    category: "ML Core"
  },
  {
    id: "fc-4",
    domainId: 1,
    term: "Overfitting vs Underfitting",
    termVi: "Quá khớp vs Chưa khớp",
    definition: "• Overfitting: kết quả trên train tốt hơn rõ rệt so với validation/test; mô hình khó khái quát. Có thể xem xét thêm dữ liệu đại diện, regularization, giảm độ phức tạp hoặc điều chỉnh quy trình huấn luyện.\n• Underfitting: kết quả kém cả trên train và validation; cần chẩn đoán dữ liệu, đặc trưng, model và cách huấn luyện trước khi chọn biện pháp.",
    examKeyword: "High train accuracy + low test accuracy = Overfitting",
    category: "ML Core"
  },
  {
    id: "fc-5",
    domainId: 1,
    term: "Precision vs Recall",
    termVi: "Độ chuẩn xác vs Độ nhạy",
    definition: "• Precision = TP / (TP + FP): trong các dự đoán dương, có bao nhiêu dự đoán đúng; hữu ích khi false positive gây tốn kém.\n• Recall = TP / (TP + FN): trong các trường hợp dương thực tế, phát hiện được bao nhiêu; hữu ích khi bỏ sót gây tốn kém. Chọn metric theo chi phí lỗi và mục tiêu use case.",
    examKeyword: "So sánh chi phí false positive và false negative",
    category: "Evaluation"
  },
  {
    id: "fc-6",
    domainId: 1,
    term: "Amazon Rekognition",
    termVi: "Dịch vụ thị giác máy tính",
    definition: "Dịch vụ thị giác máy tính có API cho các tác vụ như phân tích ảnh/video, phát hiện hoặc so sánh khuôn mặt và kiểm duyệt nội dung. So sánh khuôn mặt chỉ tạo kết quả so khớp theo ngưỡng; tự nó không xác minh danh tính hay bảo đảm chống giả mạo.",
    examKeyword: "Image/video analysis, face comparison, content moderation",
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
    definition: "Self-attention tạo biểu diễn token bằng cách tính mức liên quan giữa token đó với các token khác trong ngữ cảnh. Transformer hỗ trợ xử lý song song ở một số bước huấn luyện; không có nghĩa mô hình luôn xem mọi từ như nhau hoặc bỏ qua giới hạn context.",
    examKeyword: "Parallel processing, Self-Attention mechanism",
    category: "GenAI Foundations"
  },
  {
    id: "fc-12",
    domainId: 2,
    term: "Tokens & Context Window",
    termVi: "Đơn vị xử lý & Cửa sổ ngữ cảnh",
    definition: "• Token là đơn vị văn bản do tokenizer của model tạo ra; quan hệ giữa token, từ và ký tự thay đổi theo ngôn ngữ và model. Không nên dùng tỷ lệ cố định để ước lượng tiếng Việt.\n• Context window là giới hạn ngữ cảnh token model có thể xử lý cho một yêu cầu; giới hạn cụ thể tùy model và cách tính input/output.",
    examKeyword: "Tokenizer-specific units; model-specific context limit",
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
    definition: "Temperature điều chỉnh mức độ ngẫu nhiên trong sampling ở các model/API hỗ trợ tham số này. Giá trị thấp thường làm đầu ra ít biến thiên hơn; giá trị cao thường tăng biến thiên. Temperature thấp không bảo đảm câu trả lời đúng hoặc hoàn toàn xác định; phạm vi và tác động tùy model/API.",
    examKeyword: "Lower temperature usually reduces sampling variability",
    category: "Hyperparameters"
  },
  {
    id: "fc-15",
    domainId: 2,
    term: "Top-P (Nucleus Sampling)",
    termVi: "Lấy mẫu xác suất tích lũy",
    definition: "Nucleus sampling chọn từ tập nhỏ nhất các token có tổng xác suất tích lũy đạt ngưỡng P, rồi sampling trong tập đó. Ví dụ P=0.9 không có nghĩa là chọn 90% số từ. Hành vi cụ thể phụ thuộc model và các decoding settings khác.",
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
    definition: "Đầu ra không được nguồn đáng tin cậy hỗ trợ hoặc chứa thông tin sai nhưng nghe có vẻ thuyết phục. RAG có thể cung cấp nguồn ngữ cảnh liên quan; grounding checks và Guardrails có thể hỗ trợ đánh giá/lọc khi cấu hình phù hợp. Không biện pháp nào bảo đảm loại bỏ mọi hallucination.",
    examKeyword: "Unsupported/fabricated output; grounding can reduce some risk",
    category: "GenAI Risks"
  },
  {
    id: "fc-18",
    domainId: 3,
    term: "RAG (Retrieval-Augmented Generation)",
    termVi: "Tạo sinh tăng cường truy xuất",
    definition: "RAG truy xuất thông tin liên quan từ nguồn dữ liệu bên ngoài model rồi đưa phần phù hợp vào ngữ cảnh để tạo câu trả lời. Có thể cập nhật kiến thức mà không fine-tune lại model, nhưng nguồn/index vẫn cần được đồng bộ hoặc ingest theo cấu hình; chất lượng retrieval và chi phí cần đánh giá.",
    examKeyword: "Retrieve external/current data at inference; no model retraining required for each update",
    category: "Foundation Models"
  },
  {
    id: "fc-19",
    domainId: 3,
    term: "Amazon Bedrock",
    termVi: "Dịch vụ GenAI Serverless hàng đầu",
    definition: "Dịch vụ được quản lý để xây dựng ứng dụng GenAI và truy cập các foundation model được hỗ trợ qua API. Không cần tự vận hành hạ tầng model như khi tự host; giá và cách triển khai phụ thuộc model, tính năng và lựa chọn inference.",
    examKeyword: "Serverless foundation models API, zero infrastructure management",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-20",
    domainId: 3,
    term: "Bedrock Knowledge Bases",
    termVi: "Tự động hóa giải pháp RAG",
    definition: "Dịch vụ hỗ trợ xây dựng workflow RAG: kết nối nguồn dữ liệu được hỗ trợ, ingest/chunk và tạo embeddings theo cấu hình, lưu vào vector store được hỗ trợ rồi truy xuất khi truy vấn. Cần cấu hình nguồn, embedding/vector store và đồng bộ lại khi dữ liệu thay đổi.",
    examKeyword: "Fully managed RAG pipeline with Amazon S3 and Vector DB",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-21",
    domainId: 3,
    term: "Bedrock Agents",
    termVi: "Tác tử AI tự động thực thi hành động",
    definition: "Agent có thể điều phối các bước, truy xuất thông tin và gọi action group đã cấu hình. Lambda là một cách thực thi action được hỗ trợ; không phải mọi agent hay action đều bắt buộc dùng Lambda. Cần giới hạn quyền và kiểm soát hành động.",
    examKeyword: "Autonomous task orchestration, invoke AWS Lambda functions",
    category: "Amazon Bedrock"
  },
  {
    id: "fc-22",
    domainId: 3,
    term: "Bedrock Guardrails",
    termVi: "Hàng rào an toàn cho GenAI",
    definition: "Có thể cấu hình policy như denied topics, content filters, lọc thông tin nhạy cảm và kiểm tra grounding. Các bộ lọc chỉ xử lý những loại nội dung/phạm vi được hỗ trợ và cấu hình; không bảo đảm chặn mọi nội dung gây hại hoặc hallucination.",
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
    definition: "Prompting yêu cầu model trình bày hoặc xử lý một bài toán theo các bước có cấu trúc. Có thể giúp một số tác vụ reasoning, nhưng không bảo đảm lập luận đúng; cần kiểm chứng kết quả.",
    examKeyword: "Think step-by-step, complex reasoning",
    category: "Prompt Engineering"
  },
  {
    id: "fc-25",
    domainId: 3,
    term: "AWS Trainium vs Inferentia",
    termVi: "Bộ đôi chip silicon chuyên dụng của AWS",
    definition: "• AWS Trainium: accelerator AWS hướng tới workload huấn luyện ML.\n• AWS Inferentia: accelerator AWS hướng tới workload inference. Hiệu năng và tổng chi phí phụ thuộc model, workload, phần mềm, cấu hình và Region; hãy đánh giá theo yêu cầu cụ thể.",
    examKeyword: "Trainium → training; Inferentia → inference",
    category: "AWS Silicon"
  },
  {
    id: "fc-26",
    domainId: 3,
    term: "Amazon SageMaker JumpStart",
    termVi: "Hub mô hình mã nguồn mở",
    definition: "SageMaker JumpStart cung cấp model assets và giải pháp mẫu để khám phá, tùy biến hoặc triển khai các model/workflow được hỗ trợ. Model, điều kiện cấp phép, tùy chọn triển khai và khả năng sẵn có thay đổi theo thời gian và Region.",
    examKeyword: "ML Hub, pre-trained open source models, 1-click deployment",
    category: "Amazon SageMaker"
  },
  {
    id: "fc-27",
    domainId: 3,
    term: "PEFT / LoRA",
    termVi: "Tinh chỉnh mô hình tiết kiệm tham số",
    definition: "Parameter-Efficient Fine-Tuning cập nhật một phần nhỏ tham số hoặc dùng adapter (ví dụ LoRA) thay vì cập nhật toàn bộ model. Có thể giảm tài nguyên so với full fine-tuning trong một số trường hợp; mức tiết kiệm phụ thuộc model, phương pháp và workload.",
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
    definition: "A2I hỗ trợ đưa con người vào một số workflow ML được hỗ trợ, chẳng hạn rà soát kết quả theo điều kiện/threshold cấu hình. Dịch vụ, tích hợp và loại dự đoán phụ thuộc workflow được hỗ trợ; không phải lớp review dùng chung cho mọi model.",
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
    definition: "Theo tài liệu AWS, prompts và outputs Amazon Bedrock không được dùng để huấn luyện foundation models của Amazon nếu khách hàng không đồng ý. Dữ liệu cung cấp cho một tác vụ tùy biến model là trường hợp khác và được xử lý theo điều khoản/tính năng tương ứng; cần đọc tài liệu dịch vụ hiện hành.",
    examKeyword: "Bedrock prompts/outputs are not used to train Amazon FMs without consent",
    category: "Security"
  },
  {
    id: "fc-33",
    domainId: 5,
    term: "VPC Endpoints (AWS PrivateLink)",
    termVi: "Kết nối mạng an toàn không qua Internet",
    definition: "VPC endpoint cung cấp đường kết nối riêng tới dịch vụ AWS được hỗ trợ mà không định tuyến qua internet công cộng. Bedrock thường dùng interface endpoint/PrivateLink; loại endpoint và cấu hình khác nhau theo dịch vụ. S3 cũng có gateway endpoint hoặc interface endpoint.",
    examKeyword: "Access Bedrock without traversing public internet, PrivateLink",
    category: "Security"
  },
  {
    id: "fc-34",
    domainId: 5,
    term: "AWS CloudTrail vs CloudWatch",
    termVi: "Nhật ký kiểm toán vs Giám sát chỉ số",
    definition: "• CloudTrail: ghi lại các hoạt động API/AWS account được hỗ trợ để audit; trường dữ liệu như source IP tùy event. Không mặc định ghi toàn bộ nội dung prompt/response.\n• CloudWatch: theo dõi metrics, logs và alarms mà dịch vụ phát ra hoặc bạn cấu hình; metric cụ thể phụ thuộc tích hợp dịch vụ.",
    examKeyword: "API audit history = CloudTrail. Operational metrics & alarms = CloudWatch",
    category: "Governance"
  },
  {
    id: "fc-35",
    domainId: 5,
    term: "AWS Artifact",
    termVi: "Cổng tải báo cáo tuân thủ bảo mật",
    definition: "AWS Artifact là cổng self-service để truy cập các tài liệu compliance của AWS. Tài liệu có thể chịu điều kiện về quyền truy cập, thỏa thuận và phạm vi; kiểm tra danh mục hiện có trong account và yêu cầu của auditor.",
    examKeyword: "Download SOC/ISO compliance reports (Phân biệt với CodeArtifact)",
    category: "Compliance"
  }
];

