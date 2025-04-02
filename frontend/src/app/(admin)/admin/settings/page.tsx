"use client";
import { useState } from "react";
import { FiUser, FiSettings, FiLock, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import Image from "next/image";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "platform", label: "Platform", icon: <FiSettings /> },
    { id: "security", label: "Security", icon: <FiLock /> },
    { id: "payments", label: "Payments", icon: <FiCreditCard /> },
  ];

  // Function to show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <FiCheckCircle className="mr-2" />
          {successMessage}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t ${
              activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-200"
            } transition-all`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="mt-4">
        {activeTab === "profile" && <ProfileSettings onSave={showSuccess} />}
        {activeTab === "platform" && <PlatformSettings onSave={showSuccess} />}
        {activeTab === "security" && <SecuritySettings onSave={showSuccess} />}
        {activeTab === "payments" && <PaymentSettings onSave={showSuccess} />}
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ onSave }: { onSave: (message: string) => void }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Admin Profile</h2>
      <div className="space-y-3">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-4">
          <Image
            src={image || "/default-avatar.png"}
            alt="Profile"
            width={16}
            height={16}
            className="w-16 h-16 rounded-full border"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email Address" className="w-full p-2 border rounded" />
        <button onClick={() => onSave("Profile updated successfully")} className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
      </div>
    </div>
  );
};

// Platform Settings Component
const PlatformSettings = ({ onSave }: { onSave: (message: string) => void }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <h2 className="text-lg font-semibold mb-3">Platform Settings</h2>
    <div className="space-y-3">
      <input type="text" placeholder="Platform Name" className="w-full p-2 border rounded" />
      <input type="number" placeholder="Service Fee (KES)" className="w-full p-2 border rounded" />
      <textarea placeholder="Terms & Conditions" className="w-full p-2 border rounded h-24"></textarea>
      <button onClick={() => onSave("Platform settings saved!")} className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  </div>
);

// Security Settings Component
const SecuritySettings = ({ onSave }: { onSave: (message: string) => void }) => {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Security Settings</h2>
      <div className="space-y-3">
        <input type="password" placeholder="Current Password" className="w-full p-2 border rounded" />
        <input type="password" placeholder="New Password" className="w-full p-2 border rounded" />
        
        {/* Toggle for Two-Factor Authentication */}
        <div className="flex items-center space-x-3">
          <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          <label>Enable Two-Factor Authentication</label>
        </div>

        <button onClick={() => onSave("Security settings updated!")} className="bg-blue-600 text-white px-4 py-2 rounded">Save Security Settings</button>
      </div>
    </div>
  );
};

// Payment Settings Component
const PaymentSettings = ({ onSave }: { onSave: (message: string) => void }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <h2 className="text-lg font-semibold mb-3">Payment Settings</h2>
    <div className="space-y-3">
      <input type="text" placeholder="Payment Gateway (e.g. M-Pesa, PayPal)" className="w-full p-2 border rounded" />
      <input type="text" placeholder="Transaction History" className="w-full p-2 border rounded" />
      <button onClick={() => onSave("Payment settings saved!")} className="bg-blue-600 text-white px-4 py-2 rounded">Save Payment Settings</button>
    </div>
  </div>
);

export default AdminSettings;
