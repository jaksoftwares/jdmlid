"use client";
import { JSX, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Table from "../components/Table";
import Modal from "../components/Modal";

// Define User type
interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  [key: string]: unknown; 
}

// Define columns based on the User type
const columns: (keyof User)[] = ["id", "full_name", "email", "phone", "created_at"];

const UsersPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  // ✅ Fetch users using React Query (cached for 10 min)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/users");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
  
  const users: User[] = Array.isArray(data) ? data : data?.users || [];

  // ✅ Update user mutation
  const updateUser = useMutation({
    mutationFn: async (updatedUser: User) => {
      await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
    },
    onSuccess: (_, updatedUser) => {
      queryClient.setQueryData(["users"], (prevUsers: User[] | undefined) =>
        prevUsers ? prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)) : []
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
  });

  // ✅ Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await fetch(`http://localhost:5000/users/${userId}`, { method: "DELETE" });
    },
    onSuccess: (_, userId) => {
      queryClient.setQueryData(["users"], (prevUsers: User[] | undefined) =>
        prevUsers ? prevUsers.filter((user) => user.id !== userId) : []
      );
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
  });

  // Handle actions in the table
  const handleActions = (user: User): JSX.Element => (
    <div className="flex space-x-2">
      <button
        onClick={() => {
          setSelectedUser(user);
          setIsEditModalOpen(true);
        }}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => {
          setSelectedUser(user);
          setIsDeleteModalOpen(true);
        }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl mb-4">Users List</h1>

      {/* Dashboard Overview */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600 mb-6">Quick insights into user data and activities.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-900">{users.length}</p>
          </div>
          <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-green-700">New Users (This Month)</h3>
            <p className="text-3xl font-bold text-green-900">
              {users.filter((user) => user.created_at.startsWith("2025-03")).length}
            </p>
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {isLoading && <p>Loading users...</p>}
      {isError && <p>Error loading users</p>}

      {/* Users Table */}
      <Table<User> columns={columns} data={users} actions={handleActions} />

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User">
        {selectedUser && (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="full_name"
              value={selectedUser.full_name}
              className="border p-2 rounded"
              onChange={(e) =>
                setSelectedUser((prev) => (prev ? { ...prev, full_name: e.target.value } : prev))
              }
            />
            <input
              type="email"
              name="email"
              value={selectedUser.email}
              className="border p-2 rounded"
              onChange={(e) =>
                setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : prev))
              }
            />
            <input
              type="text"
              name="phone"
              value={selectedUser.phone}
              className="border p-2 rounded"
              onChange={(e) =>
                setSelectedUser((prev) => (prev ? { ...prev, phone: e.target.value } : prev))
              }
            />
            <button
              onClick={() => selectedUser && updateUser.mutate(selectedUser)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this user?</p>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => selectedUser && deleteUser.mutate(selectedUser.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
