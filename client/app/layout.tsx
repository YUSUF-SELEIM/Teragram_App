import { ApolloWrapper } from "./ApolloWrapper";

import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Teragram",
    template: "%s | Teragram",
  },
  description: "Teragram is a social media platform - Simple Telegram Clone",
  icons: {
    icon: "/logo.ico",
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
        className={clsx(
          "min-h-screen bg-background font-sans antialiased vsc-initialized",
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div>
            <ApolloWrapper>{children}</ApolloWrapper>
          </div>
        </Providers>
      </body>
    </html>
  );
}
