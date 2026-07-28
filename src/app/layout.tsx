import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Toaster } from "@/components/ui/Sonner";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Han Tiet",
  description: "Han Tiet's Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"></meta>
        <title>Han Tiet</title>
      </head>
      <body className="h-screen w-screen overflow-x-hidden">
        <AppRouterCacheProvider>
          <Toaster position="bottom-right" />
          {children}
          <Analytics />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
