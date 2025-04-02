"use client";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaPaperPlane } from "react-icons/fa";

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 py-12">
      {/* Header Section */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center">
          <FaEnvelope className="text-6xl sm:text-8xl text-jkuatGreen mb-4" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-jkuatGreen">Contact Us</h1>
        <p className="text-lg sm:text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
          Reach out to us for any inquiries or assistance regarding lost IDs.
        </p>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">Send Us a Message</h2>

        <form className="space-y-5">
          {/* Name Input */}
          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full outline-none text-lg bg-transparent"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full outline-none text-lg bg-transparent"
              required
            />
          </div>

          {/* Message Input */}
          <div className="flex items-start border rounded-lg px-4 py-3">
            <FaPaperPlane className="text-gray-500 mr-3 mt-2" />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full outline-none text-lg bg-transparent"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-jkuatGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Send Message
          </button>
        </form>
      </section>

      {/* Additional Contact Info */}
      <section className="max-w-3xl mx-auto mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Other Ways to Reach Us</h2>

        <div className="mt-6 space-y-5">
          <p className="flex items-center justify-center text-lg sm:text-xl text-gray-700">
            <FaPhone className="text-jkuatGreen mr-3" /> +254 712 345 678
          </p>
          <p className="flex items-center justify-center text-lg sm:text-xl text-gray-700">
            <FaEnvelope className="text-jkuatGreen mr-3" /> support@findmylostid.com
          </p>
          <p className="flex items-center justify-center text-lg sm:text-xl text-gray-700">
            <FaMapMarkerAlt className="text-jkuatGreen mr-3" /> JKUAT, Juja, Kenya
          </p>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
