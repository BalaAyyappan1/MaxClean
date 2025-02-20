import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from "recharts";

interface Order {
  _id: string;
  createdAt: string;
}

const MonthReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [selectedMonth, setSelectedMonth] = useState(moment().startOf("month"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>("/api/order");
        const allOrders = response.data.orders;
        setOrders(allOrders);
        processMonthlyData(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processMonthlyData = (allOrders: Order[]) => {
    const monthlyOrders: Record<string, number> = {};

    allOrders.forEach((order) => {
      const monthStart = moment(order.createdAt)
        .startOf("month")
        .format("YYYY-MM");
      monthlyOrders[monthStart] = (monthlyOrders[monthStart] || 0) + 1;
    });

    setMonthlyData(monthlyOrders);
  };

  const changeMonth = (direction: number) => {
    setSelectedMonth((prevMonth) => moment(prevMonth).add(direction, "months"));
  };

  const currentMonthKey = selectedMonth.format("YYYY-MM");
  const prevMonthKey = moment(selectedMonth)
    .subtract(1, "months")
    .format("YYYY-MM");
  const nextMonthKey = moment(selectedMonth).add(1, "months").format("YYYY-MM");

  const currentMonthOrders = monthlyData[currentMonthKey] || 0;
  const previousMonthOrders = monthlyData[prevMonthKey] || 0;
  const nextMonthOrders = monthlyData[nextMonthKey] || 0;

  const growth = previousMonthOrders
    ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100
    : 0;

  // Prepare data for the chart
  const chartData = [
    {
      month: prevMonthKey,
      orders: previousMonthOrders,
    },
    {
      month: currentMonthKey,
      orders: currentMonthOrders,
    },
    {
      month: nextMonthKey,
      orders: nextMonthOrders,
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-xl font-bold">Monthly Order Growth Report</h1>

      {/* Chart Section */}
      <div style={{ marginTop: "40px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) =>
                moment(month, "YYYY-MM").format("MMM YYYY")
              }
            />
            <YAxis>
              <Label value="Orders" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              formatter={(value) => [`Orders: ${value}`]}
              labelFormatter={(label) =>
                `Month: ${moment(label, "YYYY-MM").format("MMM YYYY")}`
              }
            />
            <Legend />
            <Bar dataKey="orders" fill="#E74C3C" barSize={40} />
            {/* Growth Indicator */}
            <ReferenceLine
              x={currentMonthKey}
              stroke={growth >= 0 ? "#82ca9d" : "#ff7300"}
              strokeDasharray="3 3"
              label={{
                value: `Growth: ${growth.toFixed(2)}%`,
                position: "top",
                fill: growth >= 0 ? "#82ca9d" : "#ff7300",
              }}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Navigation Buttons */}
        <div className="mb-30 justify-between w-full flex">
          <button
            className="border px-3 py-1 bg-black/10 text-black rounded-lg"
            onClick={() => changeMonth(-1)}
          >
            Previous Month
          </button>
          <button
            className="border px-3 py-1 bg-black/10 text-black rounded-lg"
            onClick={() => changeMonth(1)}
          >
            Next Month
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthReport;
