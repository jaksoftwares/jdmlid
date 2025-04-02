"use client";
import { useState } from "react";
import Image from "next/image";
import { FiBell, FiUser, FiLogOut, FiMenu } from "react-icons/fi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Dashboard Title */}
      <h2 className="text-xl font-semibold text-jkuatGreen">Admin Dashboard</h2>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative text-jkuatGreen hover:text-jkuatYellow">
          <FiBell className="text-2xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 focus:outline-none">
            <Image src="/admin-avatar.png" alt="Admin" width={32} height={32} className="rounded-full" />
            <span className="hidden md:block text-jkuatGreen font-semibold">Admin</span>
            <FiUser className="text-xl text-jkuatGreen" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2">
              <button className="block px-4 py-2 text-jkuatGreen hover:bg-gray-100 w-full text-left">
                Profile
              </button>
              <button className=" px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left flex items-center space-x-2">
                <FiLogOut /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-jkuatGreen text-2xl">
          <FiMenu />
        </button>
      </div>
    </header>
  );
};

export default Header;
