import StatsCard from "./components/StatsCard"; // Ensure this is exported correctly
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

// ✅ Explicitly typing `tableColumns` to match `lostIds` object keys
const tableColumns: (keyof (typeof lostIds)[number])[] = ["id", "owner", "status", "dateFound"];

const Dashboard = () => {
  return (
    <div className="p-6 pl-0">
      <h1 className="text-2xl font-bold text-jkuatGreen mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Lost IDs Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Lost IDs</h2>
        <Table columns={tableColumns} data={lostIds} /> {/* ✅ Now TypeScript is happy */}
      </div>
    </div>
  );
};

export default Dashboard;
