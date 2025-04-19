"use client";
import Link from "next/link";
import { FaSearch, FaIdCard, FaCheckCircle, FaUserShield, FaInfoCircle, FaPassport, FaCar, FaBuilding, FaHospitalSymbol, FaRegCreditCard, FaSchool } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";

const feeCategories = [
  { name: "National ID", fee: 300, icon: <FaIdCard className="text-3xl text-jkuatGreen" /> },
  { name: "Passport", fee: 300, icon: <FaPassport className="text-3xl text-jkuatGreen" /> },
  { name: "Driving License", fee: 300, icon: <FaCar className="text-3xl text-jkuatGreen" /> },
  { name: "Work ID", fee: 300, icon: <FaBuilding className="text-3xl text-jkuatGreen" /> },
  { name: "NHIF Card", fee: 300, icon: <FaHospitalSymbol className="text-3xl text-jkuatGreen" /> },
  { name: "NSSF Card", fee: 300, icon: <MdCreditCard className="text-3xl text-jkuatGreen" /> },
  { name: "Bank Card", fee: 300, icon: <FaRegCreditCard className="text-3xl text-jkuatGreen" /> },
  { name: "School ID", fee: 200, icon: <FaSchool className="text-3xl text-jkuatGreen" /> },
];

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-jkuatGreen to-green-600 text-white text-center py-20 px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Lost Your ID? Find It Fast & Hassle-Free!
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Search, verify, and retrieve your lost ID easily.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/lost-ids" className="bg-jkuatYellow text-jkuatGreen px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
            🔍 Search Lost IDs
          </Link>
          <Link href="/report-id" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-jkuatGreen transition">
            📩 Report Found ID
          </Link>
        </div>
      </section>

      {/* About the Platform Section */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">About the Platform</h2>
        <div className="max-w-4xl mx-auto text-gray-700">
          <p className="mb-4">
            <span className="font-semibold text-jkuatGreen">JKUAT Find My Lost ID</span> is a digital platform designed to help students and staff locate their lost identification cards with ease. 
          </p>
          <p>
            Whether it&apos;s a school ID, national ID, or driving license, our system connects finders with owners securely and efficiently.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/about" className="text-jkuatGreen font-semibold hover:underline flex justify-center items-center gap-2">
            <FaInfoCircle /> Learn More
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 text-center bg-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Search for Your Lost ID", icon: <FaSearch />, desc: "Browse through the listed lost IDs." },
            { title: "Verify & Retrieve", icon: <FaIdCard />, desc: "Follow steps to retrieve your ID safely." },
            { title: "Collect Your ID", icon: <FaCheckCircle />, desc: "Get it back hassle-free!" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-jkuatGreen text-5xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ID Categories */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Find IDs by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "School ID", icon: "🎓", link: "/lost-ids?category=school-id" },
            { name: "National ID", icon: "🆔", link: "/lost-ids?category=national-id" },
            { name: "Driving License", icon: "🚗", link: "/lost-ids?category=driving-license" },
            { name: "Other Documents", icon: "📄", link: "/lost-ids?category=other" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-2 font-semibold">{item.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Lost ID Recovery Service Fees
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A small recovery fee helps us manage, verify, and return lost IDs securely and sustainably.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {feeCategories.map(({ name, fee, icon }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{name}</h3>
              <p className="text-center text-jkuatGreen text-lg font-bold">KES {fee}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <em>* School ID recovery is subsidized to support students.</em>
        </div>
      </div>
    </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 text-center bg-blue-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Fast & Reliable", icon: <FaCheckCircle />, desc: "Verified IDs uploaded daily." },
            { title: "Secure & Private", icon: <FaUserShield />, desc: "Your details remain confidential." },
            { title: "Student-Centered", icon: <FaIdCard />, desc: "Designed for JKUAT students' needs." }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-jkuatGreen text-5xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-6 bg-jkuatGreen text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Started Today!</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Register now and let us help you find your lost ID.
        </p>
        <Link href="/lost-ids" className="bg-jkuatYellow text-jkuatGreen px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
          🔍 Start Searching
        </Link>
      </section>
    </main>
  );
};

export default Home;
