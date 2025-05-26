// src/app/layout.tsx
import "./globals.css";
import Layout from "./components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://todo.nomadule.com/"),
  title: "Todo - Nomadule",
  description:
    "A simple and powerful Todo App powered by Nomadule.com.",
  openGraph: { images: ["/og.png"] },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen">
      <body className="min-h-screen bg-neutral-900 text-neutral-100">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}