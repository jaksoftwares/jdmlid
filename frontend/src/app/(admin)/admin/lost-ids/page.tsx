"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import AddLostID from "./addId";
import EditLostID from "./EditLostId";
import DeleteLostID from "./DeleteLostID";
import LostIDTable from "./LostIdTable";
import { LostID } from "@/types/types";

const LostIDsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<LostID | null>(null);

  const queryClient = useQueryClient();

  // Fetch Lost IDs using React Query
  const { data: lostIDs = [], isLoading, isError } = useQuery<LostID[], Error>({
    queryKey: ["lostIDs"],
    queryFn: api.fetchLostIDs,
    staleTime: 0, // Always refetch on invalidateQueries
  });

  return (
    <div className="container mx-auto p-6 pl-0">
      <h1 className="text-3xl font-bold mb-6 text-left">Lost ID Management</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading lost IDs</p>}

      {/* Overview Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Total Lost IDs</h2>
          <p className="text-2xl font-bold">{lostIDs.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Pending IDs</h2>
          <p className="text-2xl font-bold">
            {lostIDs.filter((id) => id.status === "Pending").length}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Collected IDs</h2>
          <p className="text-2xl font-bold">
            {lostIDs.filter((id) => id.status === "Collected").length}
          </p>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-6 block"
      >
        + Add Lost ID
      </button>

      {/* Lost ID Table */}
      <LostIDTable
        lostIDs={lostIDs}
        onEdit={(id) => {
          setSelectedID(id);
          setIsEditModalOpen(true);
        }}
        onDelete={(id) => {
          setSelectedID(id);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Add Lost ID Modal */}
      <AddLostID
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => {
          queryClient.invalidateQueries({ queryKey: ["lostIDs"] });
        }}
      />

      {/* Edit Lost ID Modal */}
      <EditLostID
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lostID={selectedID}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ["lostIDs"] });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteLostID
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        lostID={selectedID}
      />
    </div>
  );
};

export default LostIDsPage;
