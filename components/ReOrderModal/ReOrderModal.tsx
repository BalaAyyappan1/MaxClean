"use Client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useOrder } from "@/contexts/orderContext";
import { IoMdClose } from "react-icons/io";

interface Order {
  price: number;
  status: string;
  phoneNumber: number;
  service: string;
  address: string;
  landmark: string;
  pincode: string;
  carType: string;
}

const ReOrderModal: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(true); // State to track modal visibility
  const router = useRouter();
  const { setSelectedOrder } = useOrder();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>("/api/order");
        console.log("Full API Response:", response.data);

        const pendingOrders = response.data.orders.filter(
          (order) => order.status === "Pending"
        );

        if (pendingOrders.length > 0) {
          const latestOrder = pendingOrders[pendingOrders.length - 1]; // Get the last one
          console.log("Latest Pending Order:", latestOrder);
          setOrders([latestOrder]);
        } else {
          setOrders([]);
        }
      } catch (error) {
        toast.error(
          `Error fetching orders: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };

    fetchOrders();
  }, []);

  const handleReOrder = (order: Order) => {
    setSelectedOrder(order);
    router.push("/schedule");
  };

  const handleClose = () => {
    setIsOpen(false); // Set modal visibility to false
  };

  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  h-[350px]">
      <div className="bg-white p-2 rounded-lg shadow-lg">
        {orders.map((order, index) => (
          <div key={index} className="flex justify-between">
            <div className="flex flex-col p-4 rounded-md w-[350px]">
              <div className="flex items-center gap-2">
                <p>{order.carType}</p>
                <span>-</span>
                <p className="flex items-center">{order.service}</p>
              </div>

              <p>₹{order.price}</p>
            </div>
            <div className="flex flex-col p-2 justify-between">
              <div className="flex justify-end">
                <IoMdClose
                  className="cursor-pointer"
                  onClick={handleClose} // Close the modal when the icon is clicked
                />
              </div>

              <button
                onClick={() => handleReOrder(order)} // Pass the selected order
                className="text-center px-2 py-1 items-center justify-center text-white text-md bg-black rounded-[8px]"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReOrderModal;
