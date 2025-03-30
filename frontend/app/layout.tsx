import type { Metadata } from "next";

import "./layout.css";
import { press_start, lato, open_sans, merriweather } from "./fonts";

import { Provider } from "./provider";
import { Toaster } from "sonner";

import { Header } from "@/components/header/Header";

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
        <Provider>
          <Header />
          <div id="app-shell">{children}</div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
