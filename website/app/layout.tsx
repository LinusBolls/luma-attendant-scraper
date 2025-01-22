import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import './globals.css';

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'whojoins.me',
  description: 'See who joins your Luma events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mPlusRounded1c.className}>{children}</body>
    </html>
  );
}
