import type { Metadata } from "next";

import "./layout.css";
import { press_start, lato, open_sans, merriweather } from "./fonts";

import { Toaster } from "sonner";

import { Header } from "@/components/header/Header";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";

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
      className={`${press_start.variable} ${lato.variable} ${open_sans.variable} ${merriweather.variable}`}
    >
      <body>
        <AuthProvider>
          <QueryClientProvider>
            <ModalProvider>
              <Toaster />
              <Header />
              <div id="app-shell">{children}</div>
            </ModalProvider>
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
