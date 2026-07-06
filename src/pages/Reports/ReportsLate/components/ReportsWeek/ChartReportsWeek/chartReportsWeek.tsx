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
import "./style.scss";
import { useReportsWeek } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterReportWeek } from "constant/types";

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
  filters: FilterReportWeek;
  setFilters: (filter: FilterReportWeek) => void;
};

const BarChartReportWeek: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsWeek(filters);
    
  const totla = data?.data.at(-1)

  const listServices = {
    labels: totla?.region.map((item: any) => item.regionName || ""),
    datasets: [
      {
        label: "Hồ sơ phát sinh",
        borderColor: "#6C7EE1",
        backgroundColor: ["#6C7EE1"],
        borderWidth: 1,
        hoverBackgroundColor: ["#6C7EE1"],
        hoverBorderColor: "#6C7EE1",
        data: totla?.region.map((item: any) => item.newWeekReport || ""),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Hồ sơ huỷ",
        borderColor: "#FFC4A4",
        backgroundColor: ["#FFC4A4"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FFC4A4"],
        hoverBorderColor: "#FFC4A4",
        data: totla?.region.map((item: any) => item.rejectWeekReport || ""),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Hồ sơ đã duyệt",
        borderColor: "#92B9E3",
        backgroundColor: ["#92B9E3"],
        borderWidth: 1,
        hoverBackgroundColor: ["#92B9E3"],
        hoverBorderColor: "#92B9E3",
        data: totla?.region.map((item: any) => item.approvedWeekReport || ""),
        barThickness: 20,
        stack: "Stack 1",
      },
      {
        label: "Hồ sơ đang thực hiện",
        borderColor: "#C688EB",
        backgroundColor: ["#C688EB"],
        borderWidth: 1,
        hoverBackgroundColor: ["#C688EB"],
        hoverBorderColor: "#C688EB",
        data: totla?.region.map((item: any) => item.doingTotal || ""),
        barThickness: 20,
        stack: "Stack 1",
      },
      {
        label: "Hồ sơ chưa đủ thông tin và chưa XN phí",
        borderColor: "#F8DAD0",
        backgroundColor: ["#F8DAD0"],
        borderWidth: 1,
        hoverBackgroundColor: ["#F8DAD0"],
        hoverBorderColor: "#F8DAD0",
        data: totla?.region.map((item: any) => item.rejectWeekReport || ""),
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

export default BarChartReportWeek;
