import { Baloo_2, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const display = Baloo_2({
  subsets: ["vietnamese", "latin"],
  variable: "--font-display",
});

const body = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "Tủ đồ của mình",
  description: "Chụp đồ, xóa nền, phối outfit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}