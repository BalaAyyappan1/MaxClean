import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

interface Order {
  _id: string;
  createdAt: string;
}

const YearReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [yearlyData, setYearlyData] = useState<Record<string, number>>({});
  const [selectedYear, setSelectedYear] = useState(moment().startOf("year"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>("/api/order");
        const allOrders = response.data.orders;
        setOrders(allOrders);
        processYearlyData(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processYearlyData = (allOrders: Order[]) => {
    const yearlyOrders: Record<string, number> = {};

    allOrders.forEach((order) => {
      const yearStart = moment(order.createdAt).startOf("year").format("YYYY");
      yearlyOrders[yearStart] = (yearlyOrders[yearStart] || 0) + 1;
    });

    setYearlyData(yearlyOrders);
  };

  const changeYear = (direction: number) => {
    setSelectedYear((prevYear) => moment(prevYear).add(direction, "years"));
  };

  const currentYearKey = selectedYear.format("YYYY");
  const prevYearKey = moment(selectedYear).subtract(1, "years").format("YYYY");
  const nextYearKey = moment(selectedYear).add(1, "years").format("YYYY");

  const currentYearOrders = yearlyData[currentYearKey] || 0;
  const previousYearOrders = yearlyData[prevYearKey] || 0;
  const nextYearOrders = yearlyData[nextYearKey] || 0;

  const growth = previousYearOrders
    ? ((currentYearOrders - previousYearOrders) / previousYearOrders) * 100
    : 0;

  const chartData = [
    {
      year: prevYearKey,
      orders: previousYearOrders,
    },
    {
      year: currentYearKey,
      orders: currentYearOrders,
    },
    {
      year: nextYearKey,
      orders: nextYearOrders,
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-xl font-bold">Yearly Order Growth Report</h1>

      <div style={{ marginTop: "40px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis>
              <Label value="Orders" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip formatter={(value) => [`Orders: ${value}`]} />
            <Legend />
            <Area type="monotone" dataKey="orders" stroke="#E74C3C" fill="#E74C3C" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mb-30 justify-between w-full flex">
          <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeYear(-1)}>
              Previous Year
            </button>
          </div>
          <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeYear(1)} style={{ marginLeft: "10px" }}>
              Next Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearReport;
