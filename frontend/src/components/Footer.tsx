import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi"; // Import icons

const Footer = () => {
  return (
    <footer className="bg-jkuatGreen text-white py-8 mt-10">
      <div className="container mx-auto text-center px-4">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center space-x-6 mb-4">
          <Link href="/" className="hover:text-jkuatYellow transition duration-300">Home</Link>
          <Link href="/lost-ids" className="hover:text-jkuatYellow transition duration-300">Lost IDs</Link>
          <Link href="/about" className="hover:text-jkuatYellow transition duration-300">About</Link>
          <Link href="/contact" className="hover:text-jkuatYellow transition duration-300">Contact</Link>
          <Link href="/admin" className="hover:text-jkuatYellow transition duration-300">Admin</Link>
        </div>

        {/* Social Media (Placeholders) */}
        <div className="flex justify-center space-x-6 text-xl mb-4">
          <a href="#" className="hover:text-jkuatYellow transition duration-300">
            <FiFacebook />
          </a>
          <a href="#" className="hover:text-jkuatYellow transition duration-300">
            <FiTwitter />
          </a>
          <a href="#" className="hover:text-jkuatYellow transition duration-300">
            <FiInstagram />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} JKUAT Find My Lost ID. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
