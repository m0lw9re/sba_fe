import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Space, Typography } from "antd";
import "./style.scss";
import { useReportsTotalLate, useReportsWeek } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterReportTotalLate } from "constant/types";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement
);

type Props = {
  filters: FilterReportTotalLate;
  setFilters: (filter: FilterReportTotalLate) => void;
};

const BarChartReportTotalLate: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsTotalLate(filters);

  const totla = data?.data.at(-1)

  const listServices = {
    labels: totla?.region.map((item: any) => item.regionName || ""),
    datasets: [
      {
        label: "Hồ sơ chậm do SBA",
        borderColor: "#0FAC56",
        backgroundColor: ["#0FAC56"],
        borderWidth: 1,
        hoverBackgroundColor: ["#0FAC56"],
        hoverBorderColor: "#0FAC56",
        data: totla?.region.map((item: any) => item.delaySBA),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Hồ sơ đang trình duyệt",
        borderColor: "#FFC4A4",
        backgroundColor: ["#FFC4A4"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FFC4A4"],
        hoverBorderColor: "#FFC4A4",
        data: totla?.region.map((item: any) => item.approveProcessing),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Hồ sơ KH chưa bổ sung thông tin",
        borderColor: "#92B9E3",
        backgroundColor: ["#92B9E3"],
        borderWidth: 1,
        hoverBackgroundColor: ["#92B9E3"],
        hoverBorderColor: "#92B9E3",
        data: totla?.region.map((item: any) => item.customerInform),
        barThickness: 20,
        stack: "Stack 0",
      },
      
    ],
  };

  const optionsBar: any = {
    indexAxis: "x" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn thông tin" : "Hiển thị thông tin"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Biểu đồ",
          forceRender: true,
          children: (
            <div>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div className="chart-item">
                  <Bar data={listServices} options={optionsBar} />
                </div>
              )}
            </div>
          ),
        },
      ]}
    />
  );
};

export default BarChartReportTotalLate;
