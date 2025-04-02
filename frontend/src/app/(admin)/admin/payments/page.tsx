"use client";
import { useState } from "react";
import { FaEye, FaUndo } from "react-icons/fa";
import Table from "../components/Table";

interface Payment extends Record<string, unknown> {
    id: string;
    user: string;
    email: string;
    amount: number;
    method: "M-Pesa" | "PayPal" | "Stripe";
    date: string;
    status: "Success" | "Pending" | "Failed";
  }

const paymentsData: Payment[] = [
  { id: "TXN12345", user: "John Doe", email: "john.doe@example.com", amount: 200, method: "M-Pesa", date: "2025-03-20", status: "Success" },
  { id: "TXN67890", user: "Jane Smith", email: "jane.smith@example.com", amount: 200, method: "PayPal", date: "2025-03-21", status: "Pending" },
  { id: "TXN98765", user: "David Kim", email: "david.kim@example.com", amount: 200, method: "Stripe", date: "2025-03-19", status: "Failed" },
];

const PaymentsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  // Handle view details
  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  // Handle refund action
  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
  };

  // Confirm refund action
  const confirmRefund = () => {
    if (selectedPayment) {
      console.log("Processing refund for:", selectedPayment.id);
      setIsRefundModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      {/* Payment Statistics Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-md text-green-800">
          <h2 className="text-lg font-semibold">Total Payments</h2>
          <p className="text-2xl font-bold">KES {paymentsData.reduce((acc, p) => acc + p.amount, 0)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-md text-blue-800">
          <h2 className="text-lg font-semibold">Successful Transactions</h2>
          <p className="text-2xl font-bold">{paymentsData.filter((p) => p.status === "Success").length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">
          <h2 className="text-lg font-semibold">Pending Transactions</h2>
          <p className="text-2xl font-bold">{paymentsData.filter((p) => p.status === "Pending").length}</p>
        </div>
      </div>

      {/* Payments Table */}
      <Table<Payment> // Explicitly specify the type parameter
  columns={["id", "user", "email", "amount", "method", "date", "status"] as (keyof Payment)[]} 
  data={paymentsData} // No need for explicit casting
  actions={(row) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleView(row)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        <FaEye />
      </button>
      <button
        onClick={() => handleRefund(row)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        <FaUndo />
      </button>
    </div>
  )}
/>

      {/* Refund Confirmation Modal */}
      {isRefundModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Refund</h3>
            <p>
              Are you sure you want to refund <strong>KES {selectedPayment.amount}</strong> to{" "}
              <strong>{selectedPayment.user}</strong>?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefund}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
