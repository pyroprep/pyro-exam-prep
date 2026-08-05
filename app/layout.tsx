import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/Footer";
import TutorChat from "@/components/TutorChat";

export const metadata: Metadata = {
  title: "Pyro Prep Academy | California Pyrotechnic Operator Exam Prep",
  description:
    "Master CA Title 19 regulations and pass your Class B Pyrotechnic Operator license exam with interactive practice tests and video modules.",
  openGraph: {
    title: "Pyro Prep Academy | California Pyrotechnic Operator Exam Prep",
    description:
      "Master CA Title 19 regulations and pass your Class B Pyrotechnic Operator license exam with interactive practice tests and video modules.",
    url: "https://pyroprep.academy",
    siteName: "Pyro Prep Academy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://anzfynvnclczxzwurfex.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <AuthProvider>
          <NavHeader />
          {children}
          <Footer />
          <TutorChat />
        </AuthProvider>
      </body>
    </html>
  );
}