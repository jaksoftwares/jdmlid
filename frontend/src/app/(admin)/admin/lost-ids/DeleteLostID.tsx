"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import { LostID } from "@/types/types";
import api from "@/utils/api"; // Assuming api.deleteLostID exists

interface DeleteLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  lostID: LostID | null;
}

const DeleteLostID = ({ isOpen, onClose, lostID }: DeleteLostIDProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteLostID(id);
    },
    onSuccess: () => {
      queryClient.setQueryData(["lostIDs"], (prev: LostID[] | undefined) =>
        prev ? prev.filter((item) => item.id !== lostID?.id) : []
      );

      alert("Lost ID deleted successfully.");
      onClose();
    },
    onError: () => {
      alert("Failed to delete Lost ID. Please try again.");
    },
  });

  const handleDelete = () => {
    if (lostID) {
      mutation.mutate(lostID.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p>Are you sure you want to delete <strong>{lostID?.owner_name}</strong>’s lost ID?</p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          disabled={mutation.status === "pending"} // ✅ FIXED: Use "pending" instead of "loading"
        >
          {mutation.status === "pending" ? "Deleting..." : "Yes, Delete"}
        </button>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteLostID;
