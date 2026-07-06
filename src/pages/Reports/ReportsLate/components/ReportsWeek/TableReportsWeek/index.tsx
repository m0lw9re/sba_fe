import { DownOutlined } from "@ant-design/icons";
import { Col, message, Modal, Space, Spin, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { CollapseCustom } from "components/CollapseCustom";
import { FilterReportWeek, GetAllCommonType } from "constant/types";
import React, { useMemo, useState } from "react";
import { useReportsWeek } from "utils/request";
import "./style.scss";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ButtonCustom from "components/ButtonCustom";
import { Excell } from "assets";
import { saveAs } from "file-saver";
import { exportExcelReportWeek } from "apis/exportExcelReportWeek";
import { BUTTON_CODES } from "constant/common";

const year = `${new Date().getFullYear()}`;
const month = `${new Date().getMonth() + 1}`;

type Props = {
  filters: FilterReportWeek;
  setFilters: (filter: FilterReportWeek) => void;
};

const TableReportWeek: React.FC<Props> = ({ filters, setFilters }) => {
  const { data, isLoading, error, mutate } = useReportsWeek(filters);

  const [exporting, setExporting] = useState(false);

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [selectedYear, selectedMonth] = filters.dateTo?.split('-') || [year, month];
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
      title: "Tổng hồ sơ nhận",
      dataIndex: "totalRecevieFile",
      align: "center",
      children: [
        {
          key: 31,
          title: `LK ${year}`,
          dataIndex: "lk",
        },
        {
          key: 32,
          title: "Phát sinh",
          dataIndex: "phatSing",
          children: [
            {
              key: 321,
              title: "Tuần báo cáo",
              dataIndex: "newWeekReport",
            },
            {
              key: 322,
              title: `${selectedMonth}/${selectedYear}`,
              dataIndex: "newMonthReport",
            },
            {
              key: 323,
              title: `${selectedYear}`,
              dataIndex: "newYearReport",
            },
          ],
        },
        {
          key: 33,
          title: "Huỷ",
          dataIndex: "huy",
          children: [
            {
              key: 331,
              title: "Tuần báo cáo",
              dataIndex: "rejectWeekReport",
            },
            {
              key: 332,
              title: `${selectedMonth}/${selectedYear}`,
              dataIndex: "rejectMonthReport",
            },
            {
              key: 333,
              title: `${selectedYear}`,
              dataIndex: "rejectYearReport",
            },
          ],
        },
      ],
    },
    {
      key: 4,
      title: "Tiến độ thực hiện",
      dataIndex: "implementationProgress",
      align: "center",
      children: [
        {
          key: 41,
          title: "Đã duyệt",
          dataIndex: "daDuyet",
          children: [
            {
              key: 411,
              title: "Tuần báo cáo",
              dataIndex: "approvedWeekReport",
            },
            {
              key: 412,
              title: `${selectedMonth}/${selectedYear}`,
              dataIndex: "approvedMonthReport",
            },
            {
              key: 413,
              title: `${selectedYear}`,
              dataIndex: "approvedYearReport",
            },
          ],
        },
        {
          key: 42,
          title: "Đang thực hiện",
          dataIndex: "processing",
          children: [
            {
              key: 421,
              title: "Tổng cộng",
              dataIndex: "doingTotal",
            },
            {
              key: 422,
              title: "Chờ bổ sung HS đang thực hiện (trễ tiến độ)",
              dataIndex: "waitingForAddition",
              children: [
                {
                  key: 4221,
                  title: "KH chưa bổ sung TT",
                  dataIndex: "doingAddInform",
                },
                {
                  key: 4222,
                  title: "Chậm do SBA",
                  dataIndex: "delaySBA",
                },
              ],
            },
            {
              key: 423,
              title: "HS đang thực hiện (đúng tiến độ)",
              dataIndex: "income",
            },
          ],
        },
        {
          key: 43,
          title: "Hồ sơ chưa đủ thông tin và chưa XN phí",
          dataIndex: "xacNhan",
          children: [
            {
              key: 431,
              title: "Tuần báo cáo",
              dataIndex: "feeWeekReport",
            },
            {
              key: 432,
              title: `${selectedMonth}/${selectedYear}`,
              dataIndex: "feeMonthReport",
            },
            {
              key: 433,
              title: `${selectedYear}`,
              dataIndex: "feeYearReport",
            },
          ],
        },
      ],
    },
  ];

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
                  lk: regionItem.lk,
                  newWeekReport: regionItem.newWeekReport,
                  newMonthReport: regionItem.newMonthReport,
                  newYearReport: regionItem.newYearReport,
                  rejectWeekReport: regionItem.rejectWeekReport,
                  rejectMonthReport: regionItem.rejectMonthReport,
                  rejectYearReport: regionItem.rejectYearReport,
                  approvedWeekReport: regionItem.approvedWeekReport,
                  approvedMonthReport: regionItem.approvedMonthReport,
                  approvedYearReport: regionItem.approvedYearReport,
                  doingTotal: regionItem.doingTotal,
                  doingAddInform: regionItem.doingAddInform,
                  delaySBA: regionItem.delaySBA,
                  income: regionItem.income,
                  feeWeekReport: regionItem.feeWeekReport,
                  feeMonthReport: regionItem.feeMonthReport,
                  feeYearReport: regionItem.feeYearReport,
                };
              }),
            },
            {
              name: <Typography.Text strong>Cộng</Typography.Text>,
              newWeekReport: (
                <Typography.Text strong>
                  {item.total.newWeekReport}
                </Typography.Text>
              ),
              newMonthReport: (
                <Typography.Text strong>
                  {item.total.newMonthReport}
                </Typography.Text>
              ),
              newYearReport: (
                <Typography.Text strong>
                  {item.total.newYearReport}
                </Typography.Text>
              ),
              rejectWeekReport: (
                <Typography.Text strong>
                  {item.total.rejectWeekReport}
                </Typography.Text>
              ),
              rejectMonthReport: (
                <Typography.Text strong>
                  {item.total.rejectMonthReport}
                </Typography.Text>
              ),
              rejectYearReport: (
                <Typography.Text strong>
                  {item.total.rejectYearReport}
                </Typography.Text>
              ),
              approvedWeekReport: (
                <Typography.Text strong>
                  {item.total.approvedWeekReport}
                </Typography.Text>
              ),
              approvedMonthReport: (
                <Typography.Text strong>
                  {item.total.approvedMonthReport}
                </Typography.Text>
              ),
              approvedYearReport: (
                <Typography.Text strong>
                  {item.total.approvedYearReport}
                </Typography.Text>
              ),
              doingTotal: (
                <Typography.Text strong>
                  {item.total.doingTotal}
                </Typography.Text>
              ),
              doingAddInform: (
                <Typography.Text strong>
                  {item.total.doingAddInform}
                </Typography.Text>
              ),
              delaySBA: (
                <Typography.Text strong>{item.total.delaySBA}</Typography.Text>
              ),
              income: (
                <Typography.Text strong>{item.total.income}</Typography.Text>
              ),
              feeWeekReport: (
                <Typography.Text strong>
                  {item.total.feeWeekReport}
                </Typography.Text>
              ),
              feeMonthReport: (
                <Typography.Text strong>
                  {item.total.feeMonthReport}
                </Typography.Text>
              ),
              feeYearReport: (
                <Typography.Text strong>
                  {item.total.feeYearReport}
                </Typography.Text>
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
        "tab1"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_tien_do_tuan.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo HS tiến độ tuần!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ theo tiến độ tuần`,
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
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                bordered={true}
                total={1}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                page={params.page || 1}
                paginationConditional={false}
                scroll={{ x: 3000, y: 500 }}
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

export default TableReportWeek;
