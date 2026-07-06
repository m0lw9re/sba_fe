import { DownOutlined } from "@ant-design/icons";
import { Col, message, Modal, Space, Typography, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterReportDetailKPIInWeek } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useKpiReportWeek } from "utils/request/useKpiReport";
import "./style.scss";
import { saveAs } from "file-saver";
import { exportReportKPIs } from "apis/exportReportKPIs";
import { BUTTON_CODES } from "constant/common";
import TableCustom from "components/TableCustom";
import { numberUtils } from "utils";

type Props = {
  filters: FilterReportDetailKPIInWeek;
  setFilters: (filter: FilterReportDetailKPIInWeek) => void;
};

const year = `${new Date().getFullYear()}`;
const month = `${new Date().getMonth() + 1}`;

const TableReportKPIInWeek: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [selectedYear, selectedMonth] = filters.dateTo?.split("-") || [
    year,
    month,
  ];

  const defaultColumns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "50px",
      align: "center",
      fixed: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      key: 2,
      title: "Tên định giá viên",
      dataIndex: "staffName",
      align: "left",
      fixed: "left",
    },
    {
      key: 3,
      title: "Phát sinh tuần",
      align: "center",
      children: [
        {
          key: 31,
          title: "Hồ sơ hoàn thành",
          dataIndex: "finishAppraisalFile",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 32,
          title: "Quy đổi HS nội thành",
          dataIndex: "tranformToUrban",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
      ],
    },
    {
      key: 4,
      title: `Luỹ kế ${selectedMonth}/${selectedYear}`,
      align: "center",
      children: [
        {
          key: 41,
          title: "HS đạt tiến độ",
          dataIndex: "inTime",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 42,
          title: "HS không đạt tiến độ",
          dataIndex: "late",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 43,
          title: "HS hoàn thành",
          dataIndex: "total",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 44,
          title: "Quy đổi HS nội thành",
          dataIndex: "tranformToUrban2",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 45,
          title: "HS KPIs quy định (tháng)",
          dataIndex: "finishAppraisalFileKpi",
          align: "right",
          render: (value) =>
            value && numberUtils.formatNumber(Number(value.toFixed(1))),
        },
        {
          key: 46,
          title: "Tỷ lệ TH/KH",
          dataIndex: "propotionReachTarget",
          align: "right",
        },
      ],
    },
  ];

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

  const { data, isLoading } = useKpiReportWeek(params, filters);

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportKPIs.exportExcel(
        {
          ...filters,
        },
        "tab2"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Bao_cao_KPI_theo_tuan.xlsx");
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
      content: `Bạn có chắc muốn xuất báo cáo KPIs theo tuần`,
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
                isLoading={!data && isLoading}
                limit={data?.limit}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportKPIInWeek;
