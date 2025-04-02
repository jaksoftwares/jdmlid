"use client";
import { useState } from "react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";

interface Claim {
  id: string;
  claimant: string;
  lostID: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const ClaimsPage = () => {
  const [, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([
    { id: "C001", claimant: "John Doe", lostID: "12345", reason: "Lost School ID", status: "Pending" },
    { id: "C002", claimant: "Jane Doe", lostID: "67890", reason: "Stolen National ID", status: "Approved" },
  ]);
  const [] = useState<Claim>({ id: "", claimant: "", lostID: "", reason: "", status: "Pending" });
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const columns: Array<keyof Claim> = ["id", "claimant", "lostID", "reason", "status"];

  // Compute Summary Stats
  const totalClaims = claims.length;
  const pendingCount = claims.filter((c) => c.status === "Pending").length;
  const approvedCount = claims.filter((c) => c.status === "Approved").length;
  const rejectedCount = claims.filter((c) => c.status === "Rejected").length;

  // Handle Form Changes

  // Handle Edit Change (Including Status)
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedClaim) return;
    setSelectedClaim({ ...selectedClaim, [e.target.name]: e.target.value });
  };

  // Handle Add Claim

  // Handle Edit Claim (Including Status Update)
  const handleEditClaim = () => {
    if (!selectedClaim) return;
    setClaims(claims.map((claim) => (claim.id === selectedClaim.id ? selectedClaim : claim)));
    setIsEditModalOpen(false);
    setSelectedClaim(null);
  };

  // Handle Delete Claim
  const handleDeleteClaim = () => {
    if (!selectedClaim) return;
    setClaims(claims.filter((claim) => claim.id !== selectedClaim.id));
    setIsDeleteModalOpen(false);
    setSelectedClaim(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Header Section */}
      <h1 className="text-2xl font-bold mb-4">Claims Management</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Claims", count: totalClaims, bg: "bg-gray-100", text: "text-black" },
          { label: "Pending", count: pendingCount, bg: "bg-yellow-100", text: "text-yellow-600" },
          { label: "Approved", count: approvedCount, bg: "bg-green-100", text: "text-green-600" },
          { label: "Rejected", count: rejectedCount, bg: "bg-red-100", text: "text-red-600" },
        ].map(({ label, count, bg, text }) => (
          <div key={label} className={`p-4 ${bg} rounded-lg text-center`}>
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className={`text-xl font-bold ${text}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Add Claim Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-4"
      >
        <FiPlusCircle />
        <span>Add Claim</span>
      </button>

      {/* Claims Table */}
      <Table
        columns={columns}
        data={claims.map((claim) => ({
          id: claim.id,
          claimant: claim.claimant,
          lostID: claim.lostID,
          reason: claim.reason,
          status: claim.status,
        }))}
        actions={(claim) => (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedClaim(claim);
                setIsEditModalOpen(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
            >
              <FiEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                setSelectedClaim(claim);
                setIsDeleteModalOpen(true);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
            >
              <FiTrash />
              <span>Delete</span>
            </button>
          </div>
        )}
      />

      {/* Edit Claim Modal (Admin can review and change status) */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Review & Update Claim">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="claimant"
            value={selectedClaim?.claimant || ""}
            className="border p-2 rounded"
            onChange={handleEditChange}
          />
          <input
            type="text"
            name="reason"
            value={selectedClaim?.reason || ""}
            className="border p-2 rounded"
            onChange={handleEditChange}
          />
          <select
            name="status"
            value={selectedClaim?.status || "Pending"}
            className="border p-2 rounded"
            onChange={handleEditChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleEditClaim} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this claim?</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={handleDeleteClaim} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
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

export default ClaimsPage;
