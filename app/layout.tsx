"use client";

import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontClass, setFontClass] = useState("text-base");

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        // 🔥 PAKAI CLASS, BUKAN PX
        setFontClass(data?.globalFontSize || "text-base");
      } catch (error) {
        console.log(error);
      }
    };

    loadSetting();
  }, []);

  return (
    <html lang="en">
      <body className={fontClass}>
        {children}
      </body>
    </html>
  );
}