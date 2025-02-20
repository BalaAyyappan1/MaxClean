"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import WeekReport from "@/components/Growth/WeekReport";
import MonthReport from "@/components/Growth/MonthReport";
import QuaterReport from "@/components/Growth/QuaterReport";
import YearReport from "@/components/Growth/YearReport";




const PageGrowth: React.FC = () => {
  const router = useRouter();

  const handleSignout = async () => {
    try {
      // Clear tokens from cookies (via API)
      await fetch("/api/auth/signout", { method: "POST" });

      // Redirect to the login pageGrowth
      router.push("/signin");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

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

      {/* Growth Graphs */}
      <div className="flex-1 md:ml-64">
        <main className="p-6  space-y-6">
          <div className="w-full p-8 space-y-8">
            <div>
              <WeekReport />
            </div>
            <div>
              <MonthReport />
            </div>
            <div>
              <QuaterReport />
            </div>
            <div>
              <YearReport />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageGrowth;
