import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  LineChart,
  Line,
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

const WeekReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [weeklyData, setWeeklyData] = useState<Record<string, number>>({});
  const [selectedWeek, setSelectedWeek] = useState(moment().startOf("isoWeek"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>("/api/order");
        const allOrders = response.data.orders;
        setOrders(allOrders);
        processWeeklyData(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processWeeklyData = (allOrders: Order[]) => {
    const weeklyOrders: Record<string, number> = {};

    allOrders.forEach((order) => {
      const weekStart = moment(order.createdAt).startOf("isoWeek").format("YYYY-MM-DD");
      weeklyOrders[weekStart] = (weeklyOrders[weekStart] || 0) + 1;
    });

    setWeeklyData(weeklyOrders);
  };

  const changeWeek = (direction: number) => {
    setSelectedWeek((prevWeek) => moment(prevWeek).add(direction, "weeks"));
  };

  const currentWeekKey = selectedWeek.format("YYYY-MM-DD");
  const prevWeekKey = moment(selectedWeek).subtract(1, "weeks").format("YYYY-MM-DD");
  const nextWeekKey = moment(selectedWeek).add(1, "weeks").format("YYYY-MM-DD");

  const currentWeekOrders = weeklyData[currentWeekKey] || 0;
  const previousWeekOrders = weeklyData[prevWeekKey] || 0;
  const nextWeekOrders = weeklyData[nextWeekKey] || 0;

  const growth = previousWeekOrders
    ? ((currentWeekOrders - previousWeekOrders) / previousWeekOrders) * 100
    : 0;

  // Prepare data for the chart
  const chartData = [
    {
      week: prevWeekKey,
      orders: previousWeekOrders,
    },
    {
      week: currentWeekKey,
      orders: currentWeekOrders,
    },
    {
      week: nextWeekKey,
      orders: nextWeekOrders,
    },
  ];

  // Format date to "dd, mm, yyyy"
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD- MM- YYYY");
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-xl font-bold">Weekly Order Growth Report</h1>

      {/* Chart Section */}
      <div style={{ marginTop: "40px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickFormatter={formatDate} // Format X-axis labels
            >
              
            </XAxis>
            <YAxis>
              <Label value="Orders" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              formatter={(value) => [`Orders: ${value}`]}
              labelFormatter={(label) => `Week: ${formatDate(label)}`} // Format tooltip label
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#E74C3C"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            {/* Growth Status Annotation */}
            <ReferenceLine
              x={currentWeekKey}
              stroke="#82ca9d"
              strokeDasharray="3 3"
              label={{
                value: `Growth: ${growth.toFixed(2)}%`,
                position: "top",
                fill: growth >= 0 ? "#82ca9d" : "#ff7300",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mb-30 justify-between w-full flex">
            <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeWeek(-1)} >Previous Week</button>

            </div>
            <div>
            <button className="border px-3 py-1 bg-black/10 text-black rounded-lg" onClick={() => changeWeek(1)} style={{ marginLeft: "10px" }}>
            Next Week
          </button>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default WeekReport;