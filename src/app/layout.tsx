import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "AI Pronunciation Trainer",
  description: "Practice, record and get AI feedback on your pronunciation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
