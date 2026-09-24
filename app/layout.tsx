import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ERP Company Platform — ต้นแบบเพื่อหารือ",
  description:
    "ต้นแบบระบบ ERP สำหรับสาธิตและเก็บความต้องการ ข้อมูลทั้งหมดเป็นข้อมูลสมมติ",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
