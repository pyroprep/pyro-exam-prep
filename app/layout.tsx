import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import NavHeader from "@/components/nav-header";

export const metadata: Metadata = {
  title: "Pyro Prep Academy — California OSFM Title 19 Exam Prep",
  description:
    "Master the California OSFM Title 19 Pyrotechnic Operator Exam. Practice with real-world questions, track your readiness, and stay compliant with 2026 regulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <AuthProvider>
          <NavHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
