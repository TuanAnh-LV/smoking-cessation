import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const StageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500">No progress data available.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4 className="font-semibold mb-2">📈 Cigarette Count per Day</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            allowDecimals={false}
            label={{ value: "Cigarettes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Line type="monotone" dataKey="cigarettes" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StageChart;
