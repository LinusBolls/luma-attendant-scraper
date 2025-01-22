import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "whojoins.me",
  description: "Network better with whojoins.me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-dvh">
        {children}
      </body>
    </html>
  );
}
