import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ColumnChartProps {
  data: {
    key: string;
    index: number;
    name: string;
    "Hồ sơ tồn đầu kỳ": number;
    "Hồ sơ hoàn thành đúng tiến độ": number;
    "Hồ sơ hoàn thành không đúng tiến độ": number;
    "Hồ sơ tồn cuối kỳ": number;
    "Hồ sơ nhận trong kỳ": number;
    "Hồ sơ huỷ trong kỳ": number;
  }[];
}

const ColumnChart: React.FC<ColumnChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        className="barChartReport"
        width={1000}
        height={400}
        data={data}
        barCategoryGap={200}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Hồ sơ tồn đầu kỳ" fill="#0FAC56" barSize={20} stackId="stack"/>
        <Bar
          dataKey="Hồ sơ hoàn thành không đúng tiến độ"
          stackId="stack"
          fill="#FF0000"
          barSize={20}
        />
        <Bar
          dataKey="Hồ sơ hoàn thành đúng tiến độ"
          stackId="stack"
          fill="#2A81D0"
          barSize={20}
        />

        <Bar dataKey="Hồ sơ tồn cuối kỳ" fill="#F79943" barSize={20} stackId="stack"/>
        <Line type="monotone" dataKey="Hồ sơ nhận trong kỳ" stroke="#00C2FF" />
        <Line type="monotone" dataKey="Hồ sơ huỷ trong kỳ" stroke="#9243F7" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ColumnChart;
