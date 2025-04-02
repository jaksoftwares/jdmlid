"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Detect current route
import { FiHome, FiUsers, FiFileText, FiSettings, FiDollarSign, FiBarChart2, FiMenu, FiX, FiList } from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  return (
    <aside className={`bg-jkuatGreen text-white h-screen ${isOpen ? "w-64" : "w-20"} transition-all duration-300 p-4 relative`}>
      {/* Sidebar Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl mb-4 focus:outline-none">
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <SidebarLink href="/admin" icon={<FiHome />} label="Dashboard" isOpen={isOpen} />
        <SidebarLink href="/admin/lost-ids" icon={<FiFileText />} label="Lost IDs" isOpen={isOpen} />
        <SidebarLink href="/admin/categories" icon={<FiList />} label="ID Categories" isOpen={isOpen} />
        <SidebarLink href="/admin/users" icon={<FiUsers />} label="Users" isOpen={isOpen} />
        <SidebarLink href="/admin/payments" icon={<FiDollarSign />} label="Payments" isOpen={isOpen} />
        <SidebarLink href="/admin/claims" icon={<FiFileText />} label="Claims" isOpen={isOpen} />
        <SidebarLink href="/admin/reports" icon={<FiBarChart2 />} label="Reports" isOpen={isOpen} />
        <SidebarLink href="/admin/settings" icon={<FiSettings />} label="Settings" isOpen={isOpen} />
      </nav>
    </aside>
  );
};

// Sidebar Link Component with Active Highlight
const SidebarLink = ({ href, icon, label, isOpen }: { href: string; icon: React.ReactNode; label: string; isOpen: boolean }) => {
  const pathname = usePathname(); // Get current route
  const isActive = pathname === href; // Check if current route is active

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 text-lg p-2 rounded-md transition ${
        isActive ? "bg-jkuatYellow text-black font-semibold" : "hover:bg-jkuatYellow"
      }`}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

export default Sidebar;
