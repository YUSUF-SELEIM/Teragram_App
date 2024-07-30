import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NextUI",
    template: "%s | NextUI",
  },
  description: "NextUI is a React component library with over 50 components.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <main className="container flex-grow px-6 pt-16 mx-auto max-w-7xl">
              {children}
            </main>
            <footer className="flex items-center justify-center w-full py-3" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
