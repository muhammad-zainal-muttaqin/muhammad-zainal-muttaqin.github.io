export const links = {
  github: "https://github.com/muhammad-zainal-muttaqin",
  linkedin: "https://www.linkedin.com/in/muhammad-zainal-muttaqin",
  scholar: "https://scholar.google.com/citations?user=xDs3c9wAAAAJ",
  source: "https://github.com/muhammad-zainal-muttaqin/muhammad-zainal-muttaqin.github.io",
  email: "mz.muttaqin1@gmail.com",
  dataset: "https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC",
  api: "https://github.com/muhammad-zainal-muttaqin/sawit-vision-api",
};

export const proof = [
  { big: "953 trees", small: "in SawitMVC, the multi-view dataset I helped build (3,992 photos)" },
  { big: "1st author", small: "IEEE ICIC 2026 paper on tree-level bunch counting" },
  { big: "3 shipped tools", small: "REST API, in-browser model, Android field app" },
];

export const cases = [
  {
    tag: "Research · 2026",
    org: "Universitas Lambung Mangkurat",
    who: "Paper: IEEE ICIC 2026, 1st author",
    title: "Counting bunches per tree, not per photo",
    problem: "Each tree is photographed from 4 or 8 sides, so one bunch shows up in several photos. Adding up the detections overcounts by about 1.8×.",
    did: "Compared 29 hand-written de-duplication rules with SVM and random-forest counters on 953 trees from two plantations, keeping the detector fixed. Wrote audits that caught inconsistent cross-view links in the ground truth and fixed 48 trees.",
    result: "Given correct detections, the counter is right within ±1 bunch per grade for 96.1% of trees. With real YOLO detections it drops to 71.6%, and all 15 detector × counter pairs land between 64% and 72%. The detector is the bottleneck, not the counting.",
    stack: "Python · Ultralytics YOLO26 · scikit-learn · pandas",
    links: [
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/research-method-dedup" },
      { label: "Public baseline", href: "https://github.com/ULM-SawitMVC/Baseline-SawitMVC" },
      { label: "Dataset", href: "https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC" },
    ],
    chart: {
      title: "Trees counted within ±1 bunch per grade",
      rows: [
        { label: "SVM, correct detections", value: 96.1 },
        { label: "Best hand-written rule", value: 87.6 },
        { label: "Full pipeline from YOLO", value: 71.6, weak: true },
      ],
      note: "953 trees, DAMIMAS and LONSUM plantations. Macro accuracy over B1–B4.",
    },
  },
  {
    tag: "Engineering · 2026",
    org: "Personal project",
    who: "Solo",
    title: "Sawit Vision API",
    problem: "A research checkpoint is not something a farm app or another team can call.",
    did: "Wrapped the detector I trained in a FastAPI service. Exported it to ONNX and rewrote letterboxing and NMS in NumPy, so it runs without PyTorch. Every request is logged to SQLite, tests run on real field photos in CI, and it ships as a Docker image.",
    result: "37 ms per photo on an M1 with CoreML. On 568 new field photos the YOLO26n model put 2 boxes on ground or trunk, where the older YOLOv8n put 216.",
    stack: "Python · ONNX Runtime · FastAPI · SQLite · pytest · Docker · GitHub Actions",
    links: [
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/sawit-vision-api" },
      { label: "Demo", href: "#demo" },
    ],
    img: { src: "/thumbs/sawit-api.jpg", alt: "Oil palm tree with each fruit bunch boxed and graded B1 to B4", caption: "API output on a field photo the model never saw." },
  },
  {
    tag: "Tooling · 2026",
    org: "ULM SawitMVC lab",
    who: "I wrote the code",
    title: "PalmAnnotate, the tool the dataset was built with",
    problem: "Multi-view labels need more than boxes: annotators have to say which box on side 2 is the same bunch as a box on side 3.",
    did: "Built an offline browser app to fix YOLO boxes, link the same bunch across neighbouring sides and export one JSON file per tree. Then rebuilt it as a native Android app for field work: camera capture, an Orbbec depth camera over USB, GPS, and on-device detection with ONNX Runtime.",
    result: "Used to build the SawitMVC dataset. The Android app is built by CI and released as an APK (v0.3.77, October 2026).",
    stack: "JavaScript · Kotlin · Jetpack Compose · Room · Hilt · ONNX Runtime · GitHub Actions",
    links: [
      { label: "Web app", href: "https://muhammad-zainal-muttaqin.github.io/tools_sawit/" },
      { label: "Android code", href: "https://github.com/ULM-SawitMVC/PalmAnnotate-Kotlin" },
      { label: "Web code", href: "https://github.com/ULM-SawitMVC/PalmAnnotate" },
    ],
    img: { src: "/thumbs/palmannotate.jpg", alt: "PalmAnnotate de-duplication screen: two side views of a tree with linked bunch boxes", caption: "Linking the same bunch across two sides of a tree." },
  },
];

export const cards = [
  {
    tag: "Research · 2026",
    title: "Does a depth camera help?",
    text: "Trained YOLO26l, RT-DETR-L and RF-DETR-L on RGB and on 4-channel RGB+depth, across about 80 logged experiments. Depth helped find bunches but not grade them, and I traced a misleading comparison to an 80-day gap between two capture campaigns.",
    fig: "0.736 → 0.764",
    figcap: "AP50 for finding bunches, RGB vs RGB+D",
    links: [{ label: "Code and log", href: "https://github.com/muhammad-zainal-muttaqin/project-expertise" }],
  },
  {
    tag: "Research · 2026",
    title: "A fair detector benchmark",
    text: "A fixed protocol on 3,992 images and 17,987 boxes: dataset audit, resolution sweep, learning curve, 11 architectures × 2 seeds, one-stage vs two-stage. Then 153+ automated tuning runs to see how far the ceiling moves.",
    fig: "+4.5%",
    figcap: "best tuned mAP50 over baseline (0.504 → 0.527)",
    links: [
      { label: "Benchmark", href: "https://github.com/muhammad-zainal-muttaqin/brand-new-yolo" },
      { label: "Auto-search", href: "https://github.com/muhammad-zainal-muttaqin/Hermes-YOLO" },
    ],
  },
  {
    tag: "Side project · 2026",
    title: "Protein secondary structure",
    text: "Predicts helix, sheet or coil for each amino acid. Four steps from a 1D CNN baseline to ResCNN + BiLSTM + attention tuned with Optuna, tested on the held-out CB513 set.",
    fig: "82.4%",
    figcap: "Q3 accuracy on CB513",
    links: [{ label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/protein-cnn" }],
  },
];

export const software = [
  {
    title: "RumahSakitKu, a hospital information system",
    text: "Laravel 12 and Filament admin with 25 modules: registration, ER, inpatient beds, lab, radiology, pharmacy stock, billing and audit log. Client services for the BPJS and SatuSehat APIs, queued sync jobs, cached dashboards, and 64 test files.",
    stack: "PHP · Laravel · Filament · MySQL · Docker",
    links: [{ label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/RumahSakitKu" }],
  },
  {
    title: "TranslationTXT",
    text: "Translates long text and subtitle files with any OpenAI-compatible, Anthropic or Gemini model. Chunks with overlap, runs parts in parallel, retries failures, and only unlocks the download when every part passes. Keys stay in the browser.",
    stack: "TypeScript · Next.js · LLM APIs",
    links: [
      { label: "Live", href: "https://translation-txt.vercel.app/" },
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/translation-txt" },
    ],
  },
  {
    title: "Petty-cash receipts with Gemini",
    text: "Web form that reads the total from a photographed receipt with the Gemini API and files it to Google Sheets, plus a purchase-planning page. Team of two.",
    stack: "Python · Flask · Gemini API · Google Sheets",
    links: [{ label: "Code", href: "https://github.com/UPDLBJBxULM/PettyCashv2" }],
  },
  {
    title: "Priva Chat",
    text: "Real-time chat with end-to-end encryption (X25519, XSalsa20-Poly1305 via libsodium). The server only stores ciphertext.",
    stack: "Preact · TypeScript · Convex",
    links: [
      { label: "Live", href: "https://privachat.netlify.app" },
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/Chat-App" },
    ],
  },
  {
    title: "Daily WhatsApp report from Google Sheets",
    text: "Captures a report sheet as an image, stores it in Drive, sends it to WhatsApp on a schedule and logs each send. Replaced a manual daily step. Collaboration project.",
    stack: "Google Apps Script · REST",
    links: [{ label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/mini-project-pln" }],
  },
  {
    title: "Teaching module for AI lab assistants",
    text: "A 15-week course on running ML experiments properly (reproducibility, experiment matrices, honest evaluation), with a web app for progress and reflection journals.",
    stack: "Markdown · TypeScript",
    links: [
      { label: "Live", href: "https://module-ds.pages.dev" },
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/Module-DS" },
    ],
  },
  {
    title: "YOLO research logbook",
    text: "Dashboard of training runs: daily timeline, leaderboard by mAP, per-class results, and warnings for train–val or val–test gaps.",
    stack: "HTML · JavaScript · Cloudflare Pages",
    links: [
      { label: "Live", href: "https://yolobench.pages.dev/" },
      { label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/YOLOBench" },
    ],
  },
  {
    title: "Research reading room",
    text: "Searchable, tagged summaries of 970 papers behind our bunch-counting literature review.",
    stack: "HTML · JavaScript · GitHub Pages",
    links: [{ label: "Live", href: "https://muhammad-zainal-muttaqin.github.io/Research-Pipeline/" }],
  },
];

export const publications = [
  {
    venue: "IEEE ICIC 2026",
    title: "Benchmarking Multi-View Tree-Level Oil Palm Bunch Counting Under a Fixed Detector",
    authors: [["M. Z. Muttaqin", true], [" et al.", false]],
    first: true,
  },
  {
    venue: "Data in Brief, 2026",
    title: "SawitMVC: A multi-view oil palm fruit bunch dataset for detection and counting",
    authors: [["F. Indriani, S. W. Saputro, ", false], ["M. Z. Muttaqin", true], [" et al.", false]],
    href: "https://www.sciencedirect.com/science/article/pii/S2352340926005408",
  },
  {
    venue: "Artificial Intelligence in Health, 2026",
    title: "Few-shot personalized postprandial glucose prediction with model-agnostic neighbor fusion",
    authors: [["F. Indriani, I. Budiman, D. Kartini, R. A. Nugroho, ", false], ["M. Z. Muttaqin", true], [", M. R. Faisal", false]],
    href: "https://article.accscience.com/journal/AIH/online_first/aih026270074/article_aih0262700741_c5b5bf.pdf",
  },
  {
    venue: "IEEE ICIC 2025",
    title: "Benchmarking Deep Learning Architectures for Static Chess Position Classification",
    authors: [["M. Z. Muttaqin", true], [", F. Indriani, A. Farmadi, T. H. Saragih", false]],
    first: true,
    href: "https://ieeexplore.ieee.org/abstract/document/11309414/",
  },
];

export const experience = [
  { when: "Dec 2025 – now", title: "Research Assistant, computer vision", org: "Universitas Lambung Mangkurat", text: "Bunch detection and counting, detector benchmarks, the SawitMVC dataset and its annotation tools; also a glucose-prediction study." },
  { when: "2026 – now", title: "Freelancer", org: "Fastwork.id", text: "Data research and English–Indonesian document work." },
  { when: "2023", title: "AI trainee, MSIB batch 5", org: "Orbit Future Academy", text: "ML, deep learning, computer vision and NLP programme with a team capstone." },
  { when: "2021 – 2025", title: "B.Sc. Computer Science", org: "Universitas Lambung Mangkurat", text: "GPA 3.81 / 4.00." },
];

export const tools = [
  { group: "Detection and training", items: "PyTorch, Ultralytics YOLO, RT-DETR, RF-DETR", where: "counting research, depth study, benchmark" },
  { group: "Classical ML and data", items: "scikit-learn, pandas, NumPy, Matplotlib, SQL", where: "SVM / random-forest counters, dataset audits" },
  { group: "Deployment", items: "ONNX Runtime (Python, Web, Android), FastAPI, Docker, GitHub Actions", where: "Sawit Vision API, browser demo, PalmAnnotate" },
  { group: "Apps", items: "TypeScript, Next.js, Kotlin, Jetpack Compose, Flask, Laravel", where: "TranslationTXT, PalmAnnotate, RumahSakitKu" },
  { group: "LLMs and automation", items: "OpenAI-compatible, Anthropic and Gemini APIs; Google Apps Script; agent tools", where: "TranslationTXT, receipt reader, WhatsApp report" },
];

export const archive = [
  { year: "2026", title: "web2md", text: "Chrome extension that turns a web page into clean Markdown.", label: "Live", href: "https://muhammad-zainal-muttaqin.github.io/web2md/" },
  { year: "2025", title: "First ripeness app", text: "Streamlit app for my first YOLOv8 ripeness model.", label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/deteksi-sawit" },
  { year: "2025", title: "EPUB reader with translation", text: "Reads EPUB files in the browser and translates chapters with Gemini.", label: "Live", href: "https://muhammad-zainal-muttaqin.github.io/epubnovelgithub/" },
  { year: "2025", title: "Document translation with Gemini", text: "Streamlit app.", label: "Live", href: "https://aitranslationgemini.streamlit.app" },
  { year: "2025", title: "Novel Press", text: "Next.js and MDX site for writing and reading serial fiction.", label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/novel-press" },
  { year: "2024", title: "Receipt scanner", text: "Early OCR experiment for receipts.", label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/receipt_scanner" },
  { year: "2023", title: "NLP class project", text: "Text classification web app.", label: "Live", href: "https://sistem-pintar-nlp.vercel.app" },
  { year: "2023", title: "MSIB capstone", text: "Team Flask web app from the Orbit Future Academy AI programme.", label: "Code", href: "https://github.com/muhammad-zainal-muttaqin/proyek-akhir-orbit" },
];
