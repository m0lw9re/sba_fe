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
import { Col, Space, Typography } from "antd";
import "./style.scss";
import { useReportCompleteFile } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined, ProfileOutlined } from "@ant-design/icons";
import ButtonCustom from "components/ButtonCustom";
import { FilterReportFileComplete } from "constant/types";

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
  filters: FilterReportFileComplete;
  setFilters: (filter: FilterReportFileComplete) => void;
}
const BarChartReportCompleteFile: React.FC<Props> = ({filters, setFilters}) => {

  const { data, isLoading, mutate, error } = useReportCompleteFile(filters);

  const value = [{ quantity: data?.data.map((item: any) => item.totalCount) }];
  const totalQuantity = value[0]?.quantity
    ? value[0].quantity.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      )
    : 0;

  const values = [{ quantity: data?.data.map((item: any) => item.income) }];
  const totalIncome = values[0]?.quantity
    ? values[0].quantity.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      )
    : 0;

  const valuess = [{ quantity: data?.data.map((item: any) => item.outcome) }];
  const totalOutcome = valuess[0]?.quantity
    ? valuess[0].quantity.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      )
    : 0;

  const listServices = {
    labels: data?.data.map((item: any) => item.name),
    datasets: [
      {
        label: "Hồ sơ hoàn thành",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: ["#0FAC56"],
        borderWidth: 1,
        hoverBackgroundColor: ["#0FAC56"],
        hoverBorderColor: "rgba(75,192,192,1)",
        data: data?.data.map((item: any) => item.totalCount),
        barThickness: 20
      },
      {
        label: "Hồ sơ đạt tiến độ",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: ["#2A81D0"],
        borderWidth: 1,
        hoverBackgroundColor: ["#2A81D0"],
        hoverBorderColor: "rgba(75,192,192,1)",
        data: data?.data.map((item: any) => item.income),
        barThickness: 20
      },
      {
        label: "Hồ sơ không đạt tiến độ",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: ["#F79943"],
        borderWidth: 1,
        hoverBackgroundColor: ["#F79943"],
        hoverBorderColor: "rgba(75,192,192,1)",
        data: data?.data.map((item: any) => item.outcome),
        barThickness: 20
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
              <Col>
                <Space
                  style={{
                    display: "flex",
                    marginBottom: "8px",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileStart"
                    size="small"
                  ></ButtonCustom>
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {totalQuantity}
                    </span>
                    <br />
                    Tổng hồ sơ hoàn thành
                  </p>
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileProgress"
                    size="small"
                  ></ButtonCustom>
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {totalIncome}
                    </span>
                    <br />
                    Tổng hồ sơ đạt tiến độ
                  </p>
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileComplte"
                    size="small"
                  ></ButtonCustom>
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {totalOutcome}
                    </span>
                    <br />
                    Tổng hồ sơ không đạt tiến độ
                  </p>
                </Space>
              </Col>
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

export default BarChartReportCompleteFile;
