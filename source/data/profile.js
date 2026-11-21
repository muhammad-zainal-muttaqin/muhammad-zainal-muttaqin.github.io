export const profile = {
  name: "Muhammad Zainal Muttaqin",
  intro: [
    "I work on computer vision as a research assistant at Universitas Lambung Mangkurat in Banjarbaru, Indonesia. Most of my time goes into detecting and counting oil palm fruit bunches in field photos: collecting and labelling data, training detectors, and checking where they fail.",
    "Outside the lab I build small web and LLM tools, a few of which are live below. I graduated in Computer Science in 2025 (GPA 3.81) and I am looking for work in AI/ML, data or software, in Indonesia, remote or abroad.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/muhammad-zainal-muttaqin" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-zainal-muttaqin" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=xDs3c9wAAAAJ" },
  ],
};

export const skills = [
  { group: "Machine learning", items: "Python, PyTorch, Ultralytics YOLO, RT-DETR / RF-DETR, TensorFlow/Keras, scikit-learn; evaluation with precision/recall, mAP and counting error" },
  { group: "Computer vision", items: "object detection, multi-view de-duplication, dataset annotation and QA, OpenCV, ONNX / ONNX Runtime" },
  { group: "LLM and automation", items: "OpenAI-compatible, Anthropic and Gemini APIs; Google Apps Script; REST integrations; agent tools (OpenClaw, Hermes Agent)" },
  { group: "Data", items: "pandas, NumPy, SQL (MySQL, SQLite), Matplotlib/Seaborn, Excel" },
  { group: "Web", items: "FastAPI, Flask, Next.js/React, TypeScript, Laravel + Filament, Docker, Git, GitHub Actions" },
];

export const experience = [
  { when: "Dec 2025 – now", title: "Research Assistant, computer vision", org: "Universitas Lambung Mangkurat", text: "Fruit bunch detection and counting, detector benchmarks, the SawitMVC dataset; also a study on glucose prediction." },
  { when: "2026 – now", title: "Freelancer", org: "Fastwork.id", text: "Data research and English–Indonesian document work." },
  { when: "2023", title: "AI trainee, MSIB batch 5", org: "Orbit Future Academy", text: "ML, deep learning, CV and NLP programme with a team capstone." },
  { when: "2021 – 2025", title: "B.Sc. Computer Science (S.Kom)", org: "Universitas Lambung Mangkurat", text: "GPA 3.81 / 4.00." },
];

export const publications = [
  { authors: "M. Z. Muttaqin et al.", title: "Benchmarking Multi-View Tree-Level Oil Palm Bunch Counting Under a Fixed Detector", venue: "IEEE ICIC 2026" },
  { authors: "M. Z. Muttaqin, F. Indriani, A. Farmadi, T. H. Saragih", title: "Benchmarking Deep Learning Architectures for Static Chess Position Classification", venue: "IEEE ICIC 2025" },
  { authors: "F. Indriani, S. W. Saputro, M. Z. Muttaqin et al.", title: "SawitMVC: A multi-view oil palm fruit bunch dataset for detection and counting", venue: "Data in Brief, 2026" },
  { authors: "F. Indriani, I. Budiman, D. Kartini, R. A. Nugroho, M. Z. Muttaqin, M. R. Faisal", title: "Few-shot personalized postprandial glucose prediction with model-agnostic neighbor fusion", venue: "Artificial Intelligence in Health, 2026" },
];
