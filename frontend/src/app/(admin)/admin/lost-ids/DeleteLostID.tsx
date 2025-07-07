"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import { LostID } from "@/types/types";
import api from "@/utils/api";

interface DeleteLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  lostID: LostID | null;
}

const DeleteLostID = ({ isOpen, onClose, lostID }: DeleteLostIDProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await api.deleteLostID(id);
      return id; // Return deleted ID so we can use it in onSuccess
    },
    onSuccess: (deletedId) => {
      alert("✅ Lost ID deleted successfully.");

      // Optimistically remove deleted ID from cached list
      queryClient.setQueryData(["lostIDs"], (prev: LostID[] | undefined) =>
        prev ? prev.filter((id) => id.id !== deletedId) : []
      );

      onClose();
    },
    onError: (error) => {
      console.error("❌ Delete Error:", error);
      alert("❌ Failed to delete Lost ID. Please try again.");
    },
  });

  const handleDelete = () => {
    if (lostID) {
      mutation.mutate(lostID.id);
    }
  };

  if (!lostID) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p>
        Are you sure you want to delete{" "}
        <strong>{lostID.owner_name}</strong>’s lost ID?
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded-lg"
          disabled={mutation.isPending}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteLostID;
