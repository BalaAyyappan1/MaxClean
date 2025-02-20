"use client";
import React from "react";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  name: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;

}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  orderId,

}) => {

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch("/api/order", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (response.ok) {
        
        toast.success("Order deleted successfully");
      } else {
        toast.error(data.message || "Order deletion failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }finally {
        onClose();
      }
  };
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p className="text-gray-600 my-3">Are you sure you want to delete this order?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => orderId && handleDeleteOrder(orderId)}
>
          
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;