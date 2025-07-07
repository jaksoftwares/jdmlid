"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import StatsCard from "./components/StatsCard";
import Table from "./components/Table";
import { FiUsers, FiFileText, FiDatabase } from "react-icons/fi";

// ✅ Explicitly type columns as expected by Table
const tableColumns: ("id_number" | "owner_name" | "status" | "date_found")[] = [
  "id_number",
  "owner_name",
  "status",
  "date_found",
];

const Dashboard = () => {
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: api.fetchUsers,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: lostIds = [], isLoading: isLostIDsLoading } = useQuery({
    queryKey: ["lostIDs"],
    queryFn: api.fetchLostIDs,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchIDCategories,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

const { data: pendingClaims = [], isLoading: isPendingClaimsLoading } = useQuery({
  queryKey: ["pendingClaims", "Pending"], // Include status in key
  queryFn: ({ queryKey }) => api.fetchClaims(queryKey[1]), // Pass status to API
  staleTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
});


  return (
    <div className="p-6 pl-0">
      <h1 className="text-2xl font-bold text-jkuatGreen mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Lost IDs"
          value={isLostIDsLoading ? "..." : lostIds.length}
          icon={<FiDatabase />}
          color="bg-jkuatGreen"
        />
        <StatsCard
          title="Total Users"
          value={isUsersLoading ? "..." : users.length}
          icon={<FiUsers />}
          color="bg-blue-500"
        />
     <StatsCard
          title="Total Categories"
          value={isCategoriesLoading ? "..." : categories.length}
          icon={<FiDatabase />}
          color="bg-purple-500" // or any color of your choice
        />
          <StatsCard
          title="Pending Claims"
          value={isPendingClaimsLoading ? "..." : pendingClaims.length}
          icon={<FiFileText />}
          color="bg-red-500"
        />
      </div>

      {/* Recent Lost IDs Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Lost IDs</h2>
        {isLostIDsLoading ? (
          <p>Loading lost IDs...</p>
        ) : (
          <Table
            columns={tableColumns}
            data={lostIds
              .sort((a, b) => new Date(b.date_found).getTime() - new Date(a.date_found).getTime())
              .slice(0, 5)
              .map((id) => ({
                id_number: id.id_number,
                owner_name: id.owner_name,
                status: id.status,
                date_found: id.date_found,
              }))}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
