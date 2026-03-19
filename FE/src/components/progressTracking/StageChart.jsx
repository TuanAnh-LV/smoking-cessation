import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./StageChart.scss";

const StageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="stage-chart__empty">No progress data available.</p>;
  }

  return (
    <div className="stage-chart">
      <h4>Cigarette count trend</h4>
      <div className="stage-chart__canvas">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eadfce" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis
              allowDecimals={false}
              stroke="#6b7280"
              label={{ value: "Cigarettes", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cigarettes"
              stroke="#804622"
              strokeWidth={3}
              dot={{ r: 4, fill: "#804622" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StageChart;
