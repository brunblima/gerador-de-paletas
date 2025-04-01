import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Gerador de Paletas",
  description: "Um gerador de paletas de cores simples feito com Nexjs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
