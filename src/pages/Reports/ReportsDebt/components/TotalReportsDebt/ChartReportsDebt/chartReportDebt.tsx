import React, { useState } from "react";
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
import { useReportsTotalDebt } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterTotalReportDebt } from "constant/types";

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
  filters: FilterTotalReportDebt;
  setFilters: (filter: FilterTotalReportDebt) => void;
};

const BarChartReportTotalDebt: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsTotalDebt(filters);
    
  const totla = data?.data.at(-1)

  const listServices = {
    labels: totla?.region.map((item: any) => item.regionName || ""),
    datasets: [
      {
        label: "Công tác phí",
        borderColor: "#FFC4A4",
        backgroundColor: ["#FFC4A4"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FFC4A4"],
        hoverBorderColor: "#FFC4A4",
        data: totla?.region.map((item: any) => item.collaborationFee || ""),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Phí đợt 1",
        borderColor: "#6C7EE1",
        backgroundColor: ["#6C7EE1"],
        borderWidth: 1,
        hoverBackgroundColor: ["#6C7EE1"],
        hoverBorderColor: "#6C7EE1",
        data: totla?.region.map((item: any) => item.phase1Fee || ""),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Phí đợt 2 có XN",
        borderColor: "#FBA2B0",
        backgroundColor: ["#FBA2B0"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FBA2B0"],
        hoverBorderColor: "#FBA2B0",
        data: totla?.region.map((item: any) => item.confirmedFee || ""),
        barThickness: 20,
        stack: "Stack 1",
      },
      {
        label: "Phí đợt 2 chưa có XN",
        borderColor: "#C688EB",
        backgroundColor: ["#C688EB"],
        borderWidth: 1,
        hoverBackgroundColor: ["#C688EB"],
        hoverBorderColor: "#C688EB",
        data: totla?.region.map((item: any) => item.unconfirmedFee || ""),
        barThickness: 20,
        stack: "Stack 1",
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
      datalabels: {
        display: false // Ẩn con số trên cột
      }
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

export default BarChartReportTotalDebt;