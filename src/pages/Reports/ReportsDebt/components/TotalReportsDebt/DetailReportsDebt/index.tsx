import { DownOutlined } from "@ant-design/icons";
import { Col, Modal, Space, Spin, Typography, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { CollapseCustom } from "components/CollapseCustom";
import { FilterTotalReportDebt } from "constant/types";
import React, { useMemo, useState } from "react";
import { numberUtils } from "utils";
import { useReportsTotalDebt } from "utils/request";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import { Excell } from "assets";
import { saveAs } from "file-saver";
import { exportReportDebt } from "apis/exportReportDebt";

const defaultColumns: ColumnsType<any> = [
  {
    key: 2,
    title: "Khu vực",
    dataIndex: "name",
    align: "left",
    fixed: "left",
    width: "300px",
    render: (value) => <strong>{value}</strong>
  },
  {
    key: 3,
    title: "Tổng công nợ",
    dataIndex: "totalDebt",
    align: "right",
    render: (value) => numberUtils.formatNumber(value),
  },
  {
    key: 4,
    title: "Phí đợt 1",
    align: "center",
    children: [
      {
        key: 41,
        title: "Công tác phí",
        dataIndex: "collaborationFee",
        align: "right",
        render: (value) => numberUtils.formatNumber(value),
      },
      {
        key: 42,
        title: "Phí đợt 1",
        dataIndex: "phase1Fee",
        align: "right",
        render: (value) => numberUtils.formatNumber(value),
      },
    ],
  },
  {
    key: 5,
    title: "Phí đợt 2",
    align: "center",
    children: [
      {
        key: 51,
        title: "XN lấy KQĐG",
        dataIndex: "confirmedFee",
        align: "right",
        render: (value) => numberUtils.formatNumber(value),
      },
      {
        key: 52,
        title: "Chưa XN lấy KQĐG",
        dataIndex: "unconfirmedFee",
        align: "right",
        render: (value) => numberUtils.formatNumber(value),
      },
    ],
  },
];

type Props = {
  filters: FilterTotalReportDebt;
  setFilters: (filters: FilterTotalReportDebt) => void;
};

const TableReportDebt: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsTotalDebt(filters);
  const [exporting, setExporting] = useState(false);
  const rowClassName: any = (record: any) => {
    if (
      record.name &&
      record.name.props &&
      record.name.props.children === "Cộng"
    ) {
      return "detail-report-debt-total-row";
    }
    return undefined;
  };

  const dataSource = useMemo(() => {
    if (data?.data) {
      const dataArray = data?.data ? [...data.data] : [];
      const result = dataArray
        .map((item: any, index: number) => {
          return [
            {
              key: index + 1,
              name: item.companyBranchName,
              children: item.region.map((regionItem: any) => {
                return {
                  ...regionItem,
                  name: regionItem.regionName,
                  companyBranchName: regionItem.companyBranchName,
                  collaborationFee: regionItem.collaborationFee,
                  phase1Fee: regionItem.phase1Fee,
                  confirmedFee: regionItem.confirmedFee,
                  unconfirmedFee: regionItem.unconfirmedFee,
                };
              }),
            },
            {
              name: <Typography.Text strong>Cộng</Typography.Text>,
              totalDebt: item.total.totalDebt,
              collaborationFee: item.total.collaborationFee,
              phase1Fee: item.total.phase1Fee,
              confirmedFee: item.total.confirmedFee,
              unconfirmedFee: item.total.unconfirmedFee,
            },
          ];
        })
        .flatMap((item: any) => item);
      return result;
    }
    return [];
  }, [data?.data]);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportDebt.exportExcelReportsTotalDebt(
        filters
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "BC_HSTongHopCongNoTheoCN-KV.xlsx");
    } catch (error) {
      message.error("Xuất báo cáo thất bại!");
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo công nợ theo CN - KV?`,
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
                    justifyContent: "end",
                    marginBottom: "8px",
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
                  />
                </Space>
              </Col>
              <Table
                columns={defaultColumns}
                dataSource={dataSource}
                bordered={true}
                size="small"
                pagination={false}
                expandable={{
                  defaultExpandedRowKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                }}
                rowClassName={rowClassName}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportDebt;