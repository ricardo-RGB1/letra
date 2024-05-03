
import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Letra",
  description: "Work better, together.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/letra.svg",
        href: "/letra.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/letra-darkmode.svg",
        href: "/letra-darkmode.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="letra-theme"
          >
            <Toaster position='bottom-center'/>
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
