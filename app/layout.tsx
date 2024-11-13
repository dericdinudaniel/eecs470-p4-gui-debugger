import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

export const metadata = {
  title: "Chimp Debugger",
  description: "Built by Deric Dinu Daniel",
};

const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains_mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetbrains_mono.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
