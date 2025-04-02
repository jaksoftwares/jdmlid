"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth()

const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isAuthenticated = Boolean(user);

  return (
    <header className="bg-jkuatGreen text-white py-4 shadow-md z-50 sticky">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold hover:text-jkuatYellow transition duration-300">
            JKUAT Find My Lost ID
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-jkuatYellow transition duration-300">
            Home
          </Link>
          {["Lost IDs", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="hover:text-jkuatYellow transition duration-300"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* User Authentication & Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 hover:text-jkuatYellow transition duration-300"
              >
                <FiUser className="text-2xl bg-white text-jkuatGreen rounded-full p-1 border border-white" />
              </button>

              {/* Profile Dropdown */}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
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
                className="text-lg hover:text-jkuatYellow transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {["Lost IDs", "About", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-lg hover:text-jkuatYellow transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}

            {/* User Authentication for Mobile */}
            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 text-lg hover:text-jkuatYellow transition duration-300"
                >
                  <FiUser className="text-2xl bg-white text-jkuatGreen rounded-full p-1 border border-white" />
                </button>

                {/* Profile Dropdown for Mobile */}
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
