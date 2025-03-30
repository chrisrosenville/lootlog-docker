import {
  Press_Start_2P,
  Lato,
  Open_Sans,
  Merriweather_Sans,
} from "next/font/google";

export const press_start = Press_Start_2P({
  preload: true,
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const lato = Lato({
  preload: true,
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const open_sans = Open_Sans({
  preload: true,
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const merriweather = Merriweather_Sans({
  preload: true,
  weight: ["300", "400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});
