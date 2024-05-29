import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UnitContextProvider } from "@/contexts/UnitContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Units Dashboard",
  description:
    "Aqui você pode visualizar as unidades disponíveis e seus ativos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UnitContextProvider>{children}</UnitContextProvider>
      </body>
    </html>
  );
}
