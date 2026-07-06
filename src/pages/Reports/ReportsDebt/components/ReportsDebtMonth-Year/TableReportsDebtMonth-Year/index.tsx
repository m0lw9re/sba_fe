import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, message, Modal, Space, Spin, Table, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterReportDebtMonthYear, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useReportWeekMonth } from "utils/request";
import { defaultColumns } from "./config";
import ButtonCustom from "components/ButtonCustom";
import { Excell } from "assets";
import { saveAs } from "file-saver";
import { exportReportDebt } from "apis/exportReportDebt";
import { numberUtils } from "utils";

type Props = {
  filters: FilterReportDebtMonthYear;
  setFilters: (filters: FilterReportDebtMonthYear) => void;
};

const TableDebtMonthYear: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useReportWeekMonth(
    params,
    filters
  );

  const [exporting, setExporting] = useState(false);

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

  const columns = defaultColumns.map((item: any) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    return { ...item };
  });

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportDebt.exportExcelReportWeekMonth(
        params,
        filters
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "BC_HSBaoCaoCongNoTuanThang.xlsx");
    } catch (error) {
      message.error("Xuất báo cáo thất bại!");
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo công nợ tháng?`,
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
                  />
                </Space>
              </Col>
              <TableCustom
                dataSource={data ? data : []}
                columns={columns}
                bordered={true}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                scroll={{ x: 1920 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Typography.Text strong>Tổng cộng</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.atBegin),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.createNew),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.cashed),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) =>
                                (sum += el.noReceiveResult),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.reduce),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) =>
                                (sum += el.internalRecord),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.cashBack),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(
                            data?.reduce(
                              (sum: number, el: any) => (sum += el.atEnd),
                              0
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableDebtMonthYear;
