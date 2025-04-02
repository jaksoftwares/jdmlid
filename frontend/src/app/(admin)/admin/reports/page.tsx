"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";

// Sample Users Data
const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123456789", registrationDate: "2025-01-05" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "987654321", registrationDate: "2025-02-10" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", phone: "456789123", registrationDate: "2025-03-20" },
  { id: 4, name: "Emily Brown", email: "emily.brown@example.com", phone: "321654987", registrationDate: "2025-03-25" },
];

// Function to Get Users Count Per Month
const getUsersByMonth = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const userCounts = months.map((month) => ({ month, count: 0 }));

  users.forEach((user) => {
    const userMonth = new Date(user.registrationDate).getMonth();
    userCounts[userMonth].count += 1;
  });

  return userCounts;
};

// Function to Export CSV
const exportToCSV = () => {
  const csvData = users
    .map((user) => `${user.id},${user.name},${user.email},${user.phone},${user.registrationDate}`)
    .join("\n");

  const blob = new Blob([`ID,Name,Email,Phone,Registration Date\n${csvData}`], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "user_reports.csv");
};

// Reports Section Component
const ReportsSection = () => {
  const [filter, setFilter] = useState("monthly");

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">📊 Reports & Analytics</h2>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          Download CSV
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex space-x-4 mb-6">
        {["daily", "weekly", "monthly", "yearly"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-lg ${filter === option ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700">Total Users</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700">New Users (This Month)</h3>
          <p className="text-3xl font-bold">{getUsersByMonth().find((m) => m.month === "Mar")?.count || 0}</p>
        </div>
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-700">Active Users</h3>
          <p className="text-3xl font-bold">{Math.floor(users.length * 0.75)}</p>
        </div>
        <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700">Pending Approvals</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
      </div>

      {/* User Growth Line Chart */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 User Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getUsersByMonth()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsSection;
