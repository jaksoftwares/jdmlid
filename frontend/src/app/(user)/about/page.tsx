"use client";
import Link from "next/link";
import { FaInfoCircle, FaSearch, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 py-12">
      {/* Header Section */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <div className="flex justify-center">
          <FaInfoCircle className="text-6xl sm:text-8xl text-jkuatGreen mb-4" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-jkuatGreen">About JKUAT Find My Lost ID</h1>
        <p className="text-lg sm:text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
          A modern digital platform designed to help JKUAT students locate lost identification cards quickly and easily.
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          { icon: FaSearch, title: "Search IDs", desc: "Browse lost IDs by category and name with ease." },
          { icon: FaCheckCircle, title: "Unlock Details", desc: "Pay a small service fee to access ID location details." },
          { icon: FaShieldAlt, title: "Claim Your ID", desc: "Follow retrieval instructions and reclaim your ID." }
        ].map(({ icon: Icon, title, desc }, index) => (
          <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
            <Icon className="text-5xl sm:text-7xl text-jkuatGreen mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h2>
            <p className="text-base sm:text-lg text-gray-600 mt-2">{desc}</p>
          </div>
        ))}
      </section>

      {/* Why Use This Platform? */}
      <section className="max-w-5xl mx-auto mt-12 sm:mt-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">Why Use This Platform?</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            "Quick and easy access to lost ID information.",
            "No need for outdated notice boards—fully digital.",
            "Secure, verified lost ID reports.",
            "Save time and effort in finding your ID."
          ].map((text, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex items-center space-x-4">
              <FaCheckCircle className="text-4xl sm:text-6xl text-jkuatGreen" />
              <p className="text-lg sm:text-xl text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-5xl mx-auto mt-12 sm:mt-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Need Assistance?</h2>
        <p className="text-lg text-gray-600 mt-3">
          Get in touch with us for any inquiries or support.
        </p>
        <div className="mt-6 sm:mt-8">
          <Link
            href="/contact"
            className="inline-block bg-jkuatGreen text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-lg sm:text-xl font-semibold hover:bg-green-700 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
