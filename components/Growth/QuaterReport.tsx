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
} from "recharts";

interface Order {
  _id: string;
  createdAt: string;
}

const QuarterlyReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<Record<string, number>>({});
  const [selectedQuarter, setSelectedQuarter] = useState(moment().startOf("quarter"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>("/api/order");
        const allOrders = response.data.orders;
        setOrders(allOrders);
        processQuarterlyData(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processQuarterlyData = (allOrders: Order[]) => {
    const quarterlyOrders: Record<string, number> = {};

    allOrders.forEach((order) => {
      const quarterStart = moment(order.createdAt).startOf("quarter").format("YYYY-[Q]Q");
      quarterlyOrders[quarterStart] = (quarterlyOrders[quarterStart] || 0) + 1;
    });

    setQuarterlyData(quarterlyOrders);
  };

  const changeQuarter = (direction: number) => {
    setSelectedQuarter((prevQuarter) => moment(prevQuarter).add(direction, "quarters"));
  };

  const currentQuarterKey = selectedQuarter.format("YYYY-[Q]Q");
  const prevQuarterKey = moment(selectedQuarter).subtract(1, "quarters").format("YYYY-[Q]Q");
  const nextQuarterKey = moment(selectedQuarter).add(1, "quarters").format("YYYY-[Q]Q");

  const currentQuarterOrders = quarterlyData[currentQuarterKey] || 0;
  const previousQuarterOrders = quarterlyData[prevQuarterKey] || 0;
  const nextQuarterOrders = quarterlyData[nextQuarterKey] || 0;

  const growth = previousQuarterOrders
    ? ((currentQuarterOrders - previousQuarterOrders) / previousQuarterOrders) * 100
    : 0;

  const chartData = [
    {
      quarter: prevQuarterKey,
      orders: previousQuarterOrders,
    },
    {
      quarter: currentQuarterKey,
      orders: currentQuarterOrders,
    },
    {
      quarter: nextQuarterKey,
      orders: nextQuarterOrders,
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-xl font-bold">Quarterly Order Growth Report</h1>

      <div style={{ marginTop: "40px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis>
              <Label value="Orders" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip formatter={(value) => [`Orders: ${value}`]} />
            <Legend />
            <Bar dataKey="orders" fill="#E74C3C" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mb-30 justify-between w-full flex">
          <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeQuarter(-1)}>
              Previous Quarter
            </button>
          </div>
          <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeQuarter(1)} style={{ marginLeft: "10px" }}>
              Next Quarter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyReport;
