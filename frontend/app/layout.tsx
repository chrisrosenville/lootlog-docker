import type { Metadata } from "next";

import "./layout.css";
import { press_start, lato, open_sans, merriweather, inter } from "./fonts";

import { Header } from "@/components/header/Header";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Loot Log - Gaming News and more",
  description:
    "Loot Log is your source for the lastest news in the gaming world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${press_start.variable} ${lato.variable} ${open_sans.variable} ${merriweather.variable} ${inter.variable}`}
    >
      <body>
        <AuthProvider>
          <QueryClientProvider>
            <ToastProvider>
              <Header />
              <div id="app-shell">{children}</div>
            </ToastProvider>
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
