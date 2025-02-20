"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Order {
    landmark: string;
    price: number;
    status: string;
    phoneNumber: number;
    service: string;
    address: string;
    pincode: string;
    carType: string;
}

interface OrderContextType {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <OrderContext.Provider value={{ selectedOrder, setSelectedOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};
