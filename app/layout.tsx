import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WeeklyFit',
  description: "Journalisez vos séances d'entraînement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

