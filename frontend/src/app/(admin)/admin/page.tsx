import StatsCard from "./components/StatsCard";
import Table from "./components/Table";
import { FiUsers, FiCreditCard, FiFileText, FiDatabase } from "react-icons/fi";

// Dashboard Stats
const stats = [
  { title: "Total Lost IDs", value: 245, icon: <FiDatabase />, color: "bg-jkuatGreen" },
  { title: "Total Users", value: 1320, icon: <FiUsers />, color: "bg-blue-500" },
  { title: "Payments Processed", value: "KES 26,400", icon: <FiCreditCard />, color: "bg-yellow-500" },
  { title: "Pending Claims", value: 18, icon: <FiFileText />, color: "bg-red-500" },
];

// Recent Lost IDs Table Data
const lostIds = [
  { id: "JKUAT-001", owner: "John Doe", status: "Claimed", dateFound: "2025-03-20" },
  { id: "JKUAT-002", owner: "Jane Smith", status: "Pending", dateFound: "2025-03-18" },
  { id: "JKUAT-003", owner: "Mark Johnson", status: "Unclaimed", dateFound: "2025-03-15" },
];

// Table columns
const tableColumns: (keyof (typeof lostIds)[number])[] = ["id", "owner", "status", "dateFound"];

const Dashboard = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-jkuatGreen mb-6 text-center sm:text-left">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Lost IDs Table */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
          Recent Lost IDs
        </h2>
        <Table columns={tableColumns} data={lostIds} />
      </div>
    </div>
  );
};

export default Dashboard;
