"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ Import React Query
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "@/styles/globals.css";

// ✅ Create a Query Client instance
const queryClient = new QueryClient();

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <QueryClientProvider client={queryClient}> {/* ✅ Wrap Dashboard in Query Client */}
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300`}>
              {/* Header */}
              <Header />

              {/* Page Content */}
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
