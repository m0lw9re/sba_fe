import { DownOutlined } from "@ant-design/icons";
import {
  Col,
  Modal,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { exportReportDebt } from "apis/exportReportDebt";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterDebtComparison, GetAllCommonType } from "constant/types";
import { saveAs } from "file-saver";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ACCOUNTANT_DEBT_DETAIL,
  APPRAISAL_FILE_DETAIL,
} from "routes/route.constant";
import { useReportDebtComparison } from "utils/request";
import { defaultColumns } from "./config";
import "./style.scss";
import { BUTTON_CODES } from "constant/common";
import { numberUtils, randomId } from "utils";
import { toRoundNumber } from "utils/format";

type Props = {
  filters: FilterDebtComparison;
  setFilters: (filters: FilterDebtComparison) => void;
};

const TableDebtComparison: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useReportDebtComparison(
    params,
    filters
  );

  const dataTable = data?.data
    ? data?.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

    console.log("dta",  dataTable.assetTotalValue)

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

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 1) {
      return {
        ...item,
        render: (climsCode: any, record: any) => (
          <>
            <Link
              to={ACCOUNTANT_DEBT_DETAIL.replace(":id", record.appraisalId)}
              onClick={() => {
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
              }}
              className="link-underline"
            >
              <Tooltip title={climsCode}>
                <div className="inline-text">{climsCode}</div>
              </Tooltip>
            </Link>
          </>
        ),
      };
    }
    if (item.key === 2) {
      return {
        ...item,
        render: (climsCode: any, record: any) => (
          <>
            <Link
              to={ACCOUNTANT_DEBT_DETAIL.replace(":id", record.appraisalId)}
              onClick={() => {
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
              }}
              className="link-underline"
            >
              <Tooltip title={climsCode}>
                <div className="inline-text">{climsCode}</div>
              </Tooltip>
            </Link>
          </>
        ),
      };
    }
    return { ...item };
  });

  const dateFrom = filters.dateFrom;
  const dateTo = filters.dateTo;

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportDebt.exportExcelDebtMonthly({
        dateFrom,
        dateTo,
      });
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "BC_HSDoiChieuCongNoThang.xlsx");
    } catch (error) {
      message.error("Xuất báo cáo thất bại!");
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ đối chiếu công nợ tháng?`,
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
                    onClick={() => {
                      if (!(filters.dateFrom && filters.dateTo)) {
                        message.error(
                          "Vui lòng chọn từ ngày và đến ngày để xuất báo cáo!"
                        );
                      } else {
                        showConfirm();
                      }
                    }}
                    disabled={exporting}
                    code={BUTTON_CODES.bc_cong_no_export}
                  />
                </Space>
              </Col>
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={
                  data ? data.data.filter((el: any) => el.appraisalId) : []
                }
                isLoading={!data && isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                scroll={{ x: 3000 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Typography.Text strong>Tổng cộng</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            toRoundNumber(
                              dataTable[dataTable.length - 1]?.assetTotalValue
                            )
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.totalFee
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.bussinessFee
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.phase1Fee
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={11} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.phase2Fee
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={12} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.totalCashed
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={13} align="right">
                      <Typography.Text strong>
                        {dataTable &&
                          numberUtils.formatNumber(
                            dataTable[dataTable.length - 1]?.remainFee
                          )}
                      </Typography.Text>
                    </Table.Summary.Cell>
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

export default TableDebtComparison;