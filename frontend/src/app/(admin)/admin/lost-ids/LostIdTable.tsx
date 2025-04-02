"use client";
import { LostID } from "@/types/types";

interface TableProps {
  lostIDs: LostID[];
  onEdit: (id: LostID) => void;
  onDelete: (id: LostID) => void;
}

const LostIDTable = ({ lostIDs, onEdit, onDelete }: TableProps) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">ID Number</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Owner Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Location Found</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Date Found</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {lostIDs.map((lostID) => (
            <tr key={lostID.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium">{lostID.id_number}</td>
              <td className="px-6 py-4 text-sm font-medium">{lostID.owner_name}</td>
              <td className="px-6 py-4 text-sm font-medium">{lostID.location_found}</td>
              <td className="px-6 py-4 text-sm font-medium">{lostID.date_found}</td>
              <td className="px-6 py-4 text-sm font-medium">{lostID.status}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(lostID)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(lostID)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LostIDTable;
