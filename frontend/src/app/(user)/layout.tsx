import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "JKUAT Find My Lost ID",
  description: "Helping JKUAT students recover lost identification cards easily.",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider> {/* Wrap everything inside AuthProvider */}
          <Header />
          <main className="container mx-auto min-h-screen px-4 py-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;
