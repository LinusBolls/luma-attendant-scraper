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
      <body className="antialiased min-h-dvh">
        {children}
      </body>
    </html>
  );
}
