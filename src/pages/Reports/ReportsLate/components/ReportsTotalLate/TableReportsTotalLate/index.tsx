import { DownOutlined } from "@ant-design/icons";
import { Col, Modal, Space, Spin, Typography, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { FilterReportTotalLate, GetAllCommonType } from "constant/types";
import React, { useMemo, useState } from "react";
import { useReportsTotalLate } from "utils/request";
import "./style.scss";
import { saveAs } from "file-saver";
import { exportExcelReportWeek } from "apis/exportExcelReportWeek";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { BUTTON_CODES } from "constant/common";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "Khu vực",
    dataIndex: "name",
    align: "left",
    fixed: "left",
    width: "180px",
    render: (value) => <strong>{value}</strong>
  },
  {
    key: 2,
    title: "Tổng số HS",
    dataIndex: "totalCount",
    align: "center",
  },
  {
    key: 3,
    title: "Lý do",
    align: "center",
    children: [
      {
        key: 31,
        title: "KH chưa bổ sung thông tin",
        dataIndex: "customerInform",
      },
      {
        key: 32,
        title: "Đang trình duyệt",
        dataIndex: "approveProcessing",
      },
      {
        key: 33,
        title: "Chậm do SBA",
        dataIndex: "delaySBA",
      },
    ],
  },
];

type Props = {
  filters: FilterReportTotalLate;
  setFilters: (filter: FilterReportTotalLate) => void;
};

const TableReportTotalLate: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsTotalLate(filters);

  const [exporting, setExporting] = useState(false);

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const dataSource = useMemo(() => {
    if (data?.data) {
      // chỉ hiện thị data chso tuần 1
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
                  totalCount: regionItem.totalCount,
                  customerInform: regionItem.customerInform,
                  approveProcessing: regionItem.approveProcessing,
                  delaySBA: regionItem.delaySBA,
                };
              }),
            },
            {
              name: <Typography.Text strong>Cộng</Typography.Text>,
              companyBranchName: (
                <Typography.Text strong>
                  {item.total.companyBranchName}
                </Typography.Text>
              ),
              totalCount: (
                <Typography.Text strong>
                  {item.total.totalCount}
                </Typography.Text>
              ),
              customerInform: (
                <Typography.Text strong>
                  {item.total.customerInform}
                </Typography.Text>
              ),
              approveProcessing: (
                <Typography.Text strong>
                  {item.total.approveProcessing}
                </Typography.Text>
              ),
              delaySBA: (
                <Typography.Text strong>{item.total.delaySBA}</Typography.Text>
              ),
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
      const res = await exportExcelReportWeek.exportExcell(
        {
          ...filters
        },
        "tab3"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_tong_hop_HS_tre_tien_do.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy Báo cáo HS tổng hợp trễ tiến độ!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo tổng hợp hồ sơ trễ tiến độ`,
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
                    code={BUTTON_CODES.bcttd_export}
                  />
                </Space>
              </Col>
              <TableCustom
                columns={defaultColumns}
                dataSource={dataSource}
                bordered={true}
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
                scroll={{ y: 500 }}
                expandable={{
                  defaultExpandedRowKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportTotalLate;
