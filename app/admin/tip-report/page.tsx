"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const page: React.FC = () => {
    const router = useRouter();
    const [isTipReport, setIsTipReport] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch tip reports
    const tipreport = async () => {
        setLoading(true);
        setError(null); // Reset any previous errors
        try {
            const response = await fetch("/api/tip-report", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json(); // Parse JSON response
            console.log(data);
            setIsTipReport(data); // Set the state with the fetched data
        } catch (err) {
            console.error("Error fetching tip reports:", err);
            setError("Failed to load tip reports.");
        } finally {
            setLoading(false);
        }
    };

    // Handle sign-out
    const handleSignout = async () => {
        try {
            // Clear tokens from cookies (via API)
            await fetch("/api/auth/signout", { method: "POST" });

            // Redirect to the login page
            router.push("/signin");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };


    const downloadCSV = () => {
        if (isTipReport.length === 0) {
            alert("No data to download.");
            return;
        }
    
        // Define CSV headers
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order Id,Name,Email,Phone Number,Tips,Date\n"; // Header row
    
        // Add data rows
        isTipReport.forEach(order => {
            const row = [
                order._id,
                order.name,
                order.email,
                order.phoneNumber,
                order.paymentStatus,
                order.status,
                `₹${order.tips}`,
                new Date(order.createdAt).toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
            ].join(",");
    
            csvContent += row + "\n";
        });
    
        // Create a link to trigger the download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tip_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    // Fetch tip reports when the page loads
    useEffect(() => {
        tipreport();
    }, []);

    return (
        <div>
            <div className="w-64 bg-black fixed h-full md:block hidden text-white p-6">
                <div className="mb-8">
                    <Link href={"/"}>
                        <h1 className="text-2xl font-bold">
                            MAX<span className="text-red-500">CLEAN</span>
                        </h1>
                    </Link>
                </div>
                <nav className="space-y-4">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/tip-report"
                        className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                        <span>Tip Report</span>
                    </Link>
                    <Link
                        href="/admin/growth"
                        className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                        <span>Growth</span>
                    </Link>
                    <div className="absolute bottom-0">
                        <button
                            onClick={handleSignout}
                            className="flex items-center space-x-2 text-gray-400 p-3"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log out</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-5 h-screen justify-between">
                <main >
                    <Table className="shadow-xl">
                        <TableHeader className="rounded-md text-[20px] bg-[#EEEBEC] px-4 !py-10 !text-black">
                            <TableRow className="rounded-lg">
                            <TableHead>Order Id</TableHead>

                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Tips</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody className="text-[16px] bg-[#F6F6FA] p-3">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : isTipReport.length > 0 ? (
                                isTipReport.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>

                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{order.email}</TableCell>
                                        <TableCell>{order.phoneNumber}</TableCell>
                                        <TableCell>₹{order.tips}</TableCell>
                                        
                                        <TableCell>{order.paymentStatus}</TableCell>
                                        <TableCell>{order.status}</TableCell>



                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")} {/* for DD/MM/YYYY format */}
                                        </TableCell>
                    

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Button onClick={downloadCSV} className="text-white text-xl mt-2 bg-black whitespace-nowrap rounded-[8px] py-3">
    Download Report
</Button>

                </main>
            </div>
        </div>
    );
};

export default page;
