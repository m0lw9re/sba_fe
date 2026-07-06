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
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterReportDebtMonthYear } from "constant/types";

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
  filters: FilterReportDebtMonthYear;
  setFilters: (filter: FilterReportDebtMonthYear) => void;
};

const BarChartReportDebtMonthYear: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const mockDataService = [
    {
      name: "Đầu kỳ",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Phát sinh trong kỳ",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Đã thu",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Không nhận kết quả",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Miễn giảm",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "GNNB",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Hoàn trả",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Hồ sơ hết hiệu lực",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
    {
      name: "Tồn cuối kỳ",
      data: 107136000,
      data1: 419370000,
      data2: 1967985650,
      data3: 4758941400,
    },
  ];

  const listServices = {
    labels: mockDataService.map((item) => item.name),
    datasets: [
      {
        label: "Công tác phí",
        backgroundColor: ["#FFC4A4"],
        borderWidth: 1,
        data: mockDataService.map((item) => item.data),
        barThickness: 20,
        stack: "Stack 1",
      },
      {
        label: "Phí đợt 1",
        backgroundColor: ["#6C7EE1"],
        borderWidth: 1,
        data: mockDataService.map((item) => item.data1),
        barThickness: 20,
        stack: "Stack 1",
      },
      {
        label: "Phí đợt 2 có XN",
        backgroundColor: ["#FBA2B0"],
        borderWidth: 1,
        data: mockDataService.map((item) => item.data2),
        barThickness: 20,
        stack: "Stack 0",
      },
      {
        label: "Phí đợt 2 chưa có XN",
        backgroundColor: ["#C688EB"],
        borderWidth: 1,
        data: mockDataService.map((item) => item.data3),
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
      datalabels: {
        display: false, // Ẩn con số trên cột
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
              <div className="chart-item">
                <Bar data={listServices} options={optionsBar} />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default BarChartReportDebtMonthYear;