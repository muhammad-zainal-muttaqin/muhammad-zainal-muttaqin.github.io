import "./globals.css";

export const metadata = {
  title: "Muhammad Zainal Muttaqin – AI Engineer",
  description: "Computer vision, data and LLM projects by Muhammad Zainal Muttaqin: live demos, code and results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
