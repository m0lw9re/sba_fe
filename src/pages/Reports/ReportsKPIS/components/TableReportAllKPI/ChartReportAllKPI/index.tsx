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
import { FilterChartReportKPI } from "constant/types";
import { useReportAllKPIS } from "utils/request";

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
  filters: any;
  setFilters: (filter: FilterChartReportKPI) => void;
};

const BarChartReportAllKpi: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, mutate, error } = useReportAllKPIS(filters);

  // Transform data
  const dataTransformed = data?.data.map((item: any) => ({
    staffName: item.staffName,
    propotionAppraisalFileKPI: parseFloat(item.propotionAppraisalFileKPI),
    propotionRevenueKPI: parseFloat(item.propotionRevenueKPI),
  })) || [];

  let listServices = {
    labels: [],
    datasets: [
      {
        label: "Tỉ lệ hồ sơ TH/KH",
        backgroundColor: "#6C7EE1",
        borderWidth: 1,
        data: [],
        barThickness: 20,
      },
      {
        label: "Tỉ lệ doanh thu TH/KH",
        backgroundColor: "#FFC4A4",
        borderWidth: 1,
        data: [],
        barThickness: 20,
      },
    ],
  };

  if (dataTransformed.length > 0) {
    // Sắp xếp và lấy top 10 người có phần trăm propotionRevenueKPI lớn nhất
    const top10Data = dataTransformed
      .sort((a: any, b: any) => b.propotionRevenueKPI - a.propotionRevenueKPI)
      .slice(0, 10);

    listServices = {
      labels: top10Data.map((item: any) => item.staffName),
      datasets: [
        {
          label: "Tỉ lệ hồ sơ TH/KH",
          backgroundColor: "#6C7EE1",
          borderWidth: 1,
          data: top10Data.map((item: any) => item.propotionAppraisalFileKPI),
          barThickness: 20,
        },
        {
          label: "Tỉ lệ doanh thu TH/KH",
          backgroundColor: "#FFC4A4",
          borderWidth: 1,
          data: top10Data.map((item: any) => item.propotionRevenueKPI),
          barThickness: 20,
        },
      ],
    };
  } else {
    console.error("No data available");
  }

  const optionsBar: any = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        display: false,
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

export default BarChartReportAllKpi;