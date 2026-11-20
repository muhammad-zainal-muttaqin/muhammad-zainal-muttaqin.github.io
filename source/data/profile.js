export const profile = {
  name: "Muhammad Zainal Muttaqin",
  role: "AI Engineer · Computer Vision · Data & Automation",
  location: "Banjarbaru, Indonesia · open to on-site, remote or relocation",
  summary:
    "Computer Science graduate (GPA 3.81) and AI research assistant at Universitas Lambung Mangkurat. I build computer-vision models from raw field photos to deployed APIs, and I ship small web and LLM tools that people actually use. Two first-author IEEE papers, two co-authored journal articles.",
  links: [
    { label: "GitHub", href: "https://github.com/muhammad-zainal-muttaqin" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-zainal-muttaqin" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=xDs3c9wAAAAJ" },
  ],
  stats: [
    { value: "4", label: "publications (2 first-author, IEEE)" },
    { value: "0.77", label: "mAP@50, palm ripeness detector (val)" },
    { value: "23 ms", label: "per image after ONNX export" },
    { value: "8", label: "live demos you can open now" },
  ],
};

export const skills = [
  { group: "AI / Machine learning", items: ["Python", "PyTorch", "YOLO (v8–v11, YOLO26)", "RT-DETR / RF-DETR", "TensorFlow/Keras", "scikit-learn", "Model evaluation (P/R, mAP, counting error)"] },
  { group: "Computer vision", items: ["Object detection", "Multi-view counting & de-duplication", "Dataset annotation & QA", "OpenCV", "ONNX / ONNX Runtime"] },
  { group: "LLM & automation", items: ["LLM APIs (OpenAI-compatible, Anthropic, Gemini)", "Prompting & chunking for long documents", "AI agent tools (OpenClaw, Hermes Agent)", "Google Apps Script", "REST API integration", "Telegram bots"] },
  { group: "Data", items: ["pandas", "NumPy", "SQL (MySQL, SQLite)", "Data cleaning & ETL", "Matplotlib / Seaborn", "Excel"] },
  { group: "Web & backend", items: ["FastAPI", "Flask", "Next.js / React", "TypeScript", "Laravel + Filament", "Docker", "Git / GitHub Actions"] },
];

export const experience = [
  { when: "Dec 2025 – now", title: "Research Assistant – AI / Computer Vision", org: "Universitas Lambung Mangkurat", text: "Detection and counting of oil palm fruit bunches from field photos; benchmarking detectors; dataset building (SawitMVC); healthcare AI study on glucose prediction." },
  { when: "2026 – now", title: "Freelancer – data, writing & translation", org: "Fastwork.id", text: "Data research and English–Indonesian document projects for clients." },
  { when: "2023", title: "AI Trainee – MSIB Batch 5", org: "Orbit Future Academy", text: "Machine learning, deep learning, CV and NLP programme with a team capstone (Flask web app)." },
  { when: "2021 – 2025", title: "Bachelor of Computer Science (S.Kom)", org: "Universitas Lambung Mangkurat", text: "GPA 3.81 / 4.00." },
];

export const publications = [
  { title: "Benchmarking Multi-View Tree-Level Oil Palm Bunch Counting Under a Fixed Detector", venue: "IEEE ICIC 2026", note: "First author" },
  { title: "Benchmarking Deep Learning Architectures for Static Chess Position Classification", venue: "IEEE ICIC 2025", note: "First author" },
  { title: "SawitMVC: A multi-view oil palm fruit bunch dataset for detection and counting", venue: "Data in Brief, 2026", note: "Co-author" },
  { title: "Few-shot personalized postprandial glucose prediction with model-agnostic neighbor fusion", venue: "Artificial Intelligence in Health, 2026", note: "Co-author" },
];
