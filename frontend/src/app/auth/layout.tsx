import type { Metadata } from "next";
import "@/styles/globals.css";
export const metadata: Metadata = {
  title: "JKUAT Find My Lost ID",
  description: "Helping JKUAT students recover lost identification cards easily.",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <main className="container mx-auto min-h-screen px-4 py-6">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
