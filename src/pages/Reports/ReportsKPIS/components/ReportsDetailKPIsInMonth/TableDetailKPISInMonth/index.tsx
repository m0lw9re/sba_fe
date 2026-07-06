import { DownOutlined } from "@ant-design/icons";
import { Col, message, Modal, Space, Spin, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterReportDetailKPIInMonth } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { numberUtils } from "utils";
import { useKpiReportMonth } from "utils/request/useKpiReport";
import "./style.scss";
import { saveAs } from "file-saver";
import { exportReportKPIs } from "apis/exportReportKPIs";
import { BUTTON_CODES } from "constant/common";

const defaultColumns: ColumnsType<any> = [
  {
    key: 2,
    title: "Tên định giá viên",
    dataIndex: "staffName",
    align: "left",
    fixed: "left",
  },
  {
    key: 3,
    title: "Nhóm",
    dataIndex: "kpiGroupName",
    align: "left",
    fixed: "left",
  },
  {
    key: 4,
    title: "Hồ sơ hoàn thành",
    align: "center",
    children: [
      {
        key: 4.1,
        title: "Hồ sơ thực hiện",
        align: "left",
        children: [
          {
            key: 4.11,
            title: "Đạt tiến độ",
            align: "right",
            dataIndex: "inTime",
            render: (value) =>
              value && numberUtils.formatNumber(Number(value.toFixed(1))),
          },
          {
            key: 4.12,
            title: "Không đạt tiến độ",
            align: "right",
            dataIndex: "outTime",
            render: (value) =>
              value && numberUtils.formatNumber(Number(value.toFixed(1))),
          },
          {
            key: 4.13,
            title: "Tổng cộng",
            align: "right",
            dataIndex: "total",
            render: (value) =>
              value && numberUtils.formatNumber(Number(value.toFixed(1))),
          },
        ],
      },
      {
        key: 4.2,
        title: "Quy đổi hs nội thành",
        align: "right",
        dataIndex: "transformToUrban",
        render: (value) =>
          value && numberUtils.formatNumber(Number(value.toFixed(1))),
      },
      {
        key: 4.3,
        title: "HS KPIs quy định",
        align: "right",
        dataIndex: "finishAppraisalFileKPI",
      },
      {
        key: 4.4,
        title: "Hồ sơ vượt KPIs",
        align: "right",
        dataIndex: "finishAppraisalFileOverKpi",
        render: (value) =>
          value && numberUtils.formatNumber(Number(value.toFixed(1))),
      },
    ],
  },
  {
    key: 5,
    title: "HS thực hiện 24h",
    align: "right",
    dataIndex: "finishAppraisalFileDoneIn24h",
  },
  {
    key: 6,
    title: "HS thưởng thực hiện 24h",
    align: "right",
    dataIndex: "hosothuong24h",
  },
  {
    key: 7,
    title: "Doanh thu (đồng)",
    align: "center",
    children: [
      {
        key: 4.1,
        title: "Thực hiện",
        align: "right",
        dataIndex: "revenueExecute",
        render: (value: number) => numberUtils.formatNumber(value),
      },
      {
        key: 4.2,
        title: "KPIs quy định",
        align: "right",
        dataIndex: "revenueExecuteKPI",
        render: (value: number) => numberUtils.formatNumber(value),
      },
      {
        key: 4.3,
        title: "Doanh thu vượt KPIs",
        align: "right",
        dataIndex: "revenueExecuteOverKPI",
        render: (value: number) => numberUtils.formatNumber(value),
      },
    ],
  },
  {
    key: 6,
    title: "Số tiền thưởng vượt KPIs",
    align: "right",
    dataIndex: "totalMoneyBonus",
    render: (totalMoneyBonus, record) => {
      return numberUtils.formatNumber(Math.round(totalMoneyBonus || 0));
    },
  },
  {
    key: 7,
    title: "Trạng thái KPIs",
    align: "center",
    dataIndex: "isPassKPIMonth",
  },
];

type Props = {
  filters: FilterReportDetailKPIInMonth;
  setFilters: (filter: FilterReportDetailKPIInMonth) => void;
};

const TableReportKPIInMonth: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

  const { data, isLoading } = useKpiReportMonth(params, filters);

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportKPIs.exportExcel(
        {
          ...filters,
        },
        "tab3"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Bao_cao_KPI_theo_thang.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo KPIs theo tháng`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn" : "Hiện"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Chi tiết",
          forceRender: true,
          children: (
            <div>
              <Col>
                <Space
                  style={{
                    display: "flex",
                    marginBottom: "8px",
                    justifyContent: "end",
                    width: "100%",
                  }}
                >
                  <ButtonCustom
                    label="Xuất báo cáo"
                    icon={
                      exporting ? (
                        <div className="spin-overlay">
                          <Spin className="spin" />
                        </div>
                      ) : (
                        <Excell />
                      )
                    }
                    className={`button-Report ${exporting ? "exporting" : ""}`}
                    size="small"
                    onClick={showConfirm}
                    disabled={exporting}
                    code={BUTTON_CODES.bckpi_export}
                  />
                </Space>
              </Col>
              <TableCustom
                columns={defaultColumns}
                dataSource={data?.data || []}
                bordered={true}
                size="small"
                pagination={false}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                total={data?.total || 10}
                page={params.page || 1}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                scroll={{ x: 3000, y: 500 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportKPIInMonth;
