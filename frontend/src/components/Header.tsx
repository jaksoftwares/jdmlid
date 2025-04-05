"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation"; // ✅ Correct import
import Image from "next/image";

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname(); // ✅ Replaces router.pathname
  const isAuthenticated = Boolean(user);

  const isActive = (path: string) => {
    return pathname === path ? "text-jkuatYellow" : "hover:text-jkuatYellow";
  };

  return (
    <header className="bg-jkuatGreen text-white py-4 shadow-md z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            height={8}
            width={100}
            alt="JKUAT Find My Lost ID Logo"
            className="h-8 mr-2"
          />
         <h1 className="text-2xl font-bold hover:text-jkuatYellow transition duration-300 leading-tight">
  <span className="block sm:inline">JKUAT Find</span>{" "}
  <span className="block sm:inline">My Lost ID</span>
</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`text-lg ${isActive("/")}`}>
            Home
          </Link>
          {["Lost IDs", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className={`text-lg ${isActive(`/${item.toLowerCase().replace(" ", "-")}`)}`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* User Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 hover:text-jkuatYellow transition duration-300"
              >
                <FiUser className="text-2xl bg-white text-jkuatGreen rounded-full p-1 border border-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-md py-2 w-48">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-jkuatYellow transition duration-300">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-jkuatYellow text-jkuatGreen px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-jkuatGreen text-white py-4 mt-2 absolute top-16 left-0 w-full shadow-lg z-100">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <Link
                href="/"
                className={`text-lg ${isActive("/")}`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {["Lost IDs", "About", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className={`text-lg ${isActive(`/${item.toLowerCase().replace(" ", "-")}`)}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}

            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 text-lg hover:text-jkuatYellow transition duration-300"
                >
                  <FiUser className="text-2xl bg-white text-jkuatGreen rounded-full p-1 border border-white" />
                </button>

                {profileOpen && (
                  <div className="bg-white text-black rounded-lg shadow-md py-2 mt-2 w-48 mx-auto">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-lg hover:text-jkuatYellow transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="bg-jkuatYellow text-jkuatGreen px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
