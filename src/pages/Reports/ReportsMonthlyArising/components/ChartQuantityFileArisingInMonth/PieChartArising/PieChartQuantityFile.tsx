import {
  FilterChartQuantityFileArising,
  GetAllCommonType,
} from "constant/types";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { useReportMonthlyArising } from "utils/request";
import "./style.scss";
import { Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { numberUtils } from "utils";

type Props = {
  filters: FilterChartQuantityFileArising;
  setFilters: (filter: FilterChartQuantityFileArising) => void;
};

const PieChartArising: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, mutate, error } = useReportMonthlyArising(filters);

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  let filtered = data?.data.filter(
    (data: any) =>
      data.amount > 0 &&
      (data.name === "Hồ sơ hủy trong tháng" ||
        data.name === "Hồ sơ chờ bổ sung" ||
        data.name === "Hồ sơ chờ ĐV xác nhận phí" ||
        data.name === "Hồ sơ hoàn thành trong tháng" ||
        data.name === "Hồ sơ đang thực hiện")
  );

  let filtered2 = data?.data.filter(
    (data: any) =>
      data.amount > 0 &&
      (data.name === "Tổng HS phát sinh" ||
        data.name === "HS cấp TD" ||
        data.name === "HS XLN" ||
        data.name === "HS mua MTS")
  );

  const defaultColumns: ColumnsType<any> = [
    {
      key: 1,
      title: "Khoản mục",
      dataIndex: "name",
      align: "left",
      fixed: "left",
      width: "30%",
      className: "titleBold",
    },
    {
      key: 2,
      title: "Số lượng",
      dataIndex: "amount",
      align: "center",
      render: (value) => {
        return numberUtils.formatNumber(value)
      }
    },
  ];

  const totalAmount = filtered?.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  const dataWithPercentage = filtered?.map((item: any) => ({
    ...item,
    percentage: totalAmount ? (item.amount / totalAmount) * 100 : 0,
  }));

  const COLORS = ["#6C7EE1", "#C688EB", "#92B9E3", "#FBA2D0", "#F8DAD0"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const originalData = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${originalData.name} : ${originalData.amount}`}</p>
        </div>
      );
    }
    return null;
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
          label: "Biểu đồ báo cáo số lượng HS phát sinh",
          forceRender: true,
          children: (
            <div className="chart-container">
              <ResponsiveContainer width="50%" height={400}>
                <PieChart>
                  <Pie
                    data={dataWithPercentage}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={135}
                    fill="#82ca9d"
                    stroke="none"
                    label={(dataEntry) => `${dataEntry.percentage.toFixed(2)}%`}
                  >
                    {dataWithPercentage?.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend className="legend-container" />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{ width: "50%", display: "flex", alignItems: "center" }}
              >
                <TableCustom
                  dataSource={filtered2}
                  columns={defaultColumns}
                  bordered={false}
                  isLoading={isLoading}
                  limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                  total={1}
                  onLimitChange={(limit) => {
                    setParams({ ...params, limit });
                  }}
                  onPageChange={(page) => {
                    setParams({ ...params, page });
                  }}
                  page={params.page || 1}
                  paginationConditional={false}
                  expandable={{
                    defaultExpandedRowKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                  }}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default PieChartArising;
