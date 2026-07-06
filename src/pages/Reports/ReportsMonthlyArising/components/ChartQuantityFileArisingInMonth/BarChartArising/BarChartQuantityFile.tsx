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
import { useReportMonthlyArising } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterChartQuantityFileArising } from "constant/types";

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
  filters: FilterChartQuantityFileArising;
  setFilters: (filter: FilterChartQuantityFileArising) => void;
}

const BarChartArising: React.FC<Props> = ({filters, setFilters}) => {

  const { data, isLoading, mutate, error } = useReportMonthlyArising(filters);

  let filteredElements = data?.data.filter(
    (data: any) =>
      data.name === "Hồ sơ tồn đầu kỳ" ||
      data.name === "Hồ sơ phát sinh trong tháng" ||
      data.name === "Hồ sơ hoàn thành trong tháng" ||
      data.name === "Hồ sơ hủy trong tháng trước" ||
      data.name === "Hồ sơ còn lại cuối kỳ"
  );

  const listServices = {
    labels: filteredElements?.map((item: any) => item.name),
    datasets: [
      {
        backgroundColor: [
          "#956AD6",
          "#F179B8",
          "#EBDFEB",
          "#F0BD74",
          "#70C2B4",
        ],
        data: filteredElements?.map((item: any) => item.amount),
        barThickness: 30
      },
    ],
  };

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

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <CollapseCustom 
      expandIcon={({isActive}) => (
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
          label: "Biểu đồ báo cáo tổng số lượng hồ sơ",
          forceRender: true,
          children: (
            <div className="chart-wrapper">
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
}

export default BarChartArising;
