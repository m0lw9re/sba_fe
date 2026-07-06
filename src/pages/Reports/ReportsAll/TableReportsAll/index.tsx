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
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import "./style.scss";
import { useReportsAll } from "utils/request";
import { defaultColumns } from "./config";
import { FilterReportAll, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TableCustom from "components/TableCustom";
import ComponentsError from "pages/ComponentsError";
import { numberUtils, randomId, renderAppraisalStatus } from "utils";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { exportExcelAll } from "apis/exportReportAll";
import { saveAs } from "file-saver";
import { APPRAISAL_FILE_STATUS, BUTTON_CODES } from "constant/common";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { configFilterAppraisalFile } from "utils/string";

type Props = {
  filters: FilterReportAll;
  setFilters: (filters: FilterReportAll) => void;
};

type RefusalToPriceContentsProps = { key: string; value: string }[];

const TableReportAll: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [refusalToPriceContents, setRefusalToPriceContents] =
    useState<RefusalToPriceContentsProps>([]);

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

  const { data, isLoading, error } = useReportsAll(
    params,
    configFilterAppraisalFile(filters)
  );

  if (error) return <ComponentsError />;

  const dataTable = data?.data
    ? data?.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const handleGetRefusalToPriceContent = async (id: string) => {
    if (!id) return;
    // find refusal exist
    const findItem = refusalToPriceContents.find((item) => item.key === id);
    if (findItem) return;
    // get from api
    try {
      const res = await appraisalFilesApi.getRefusalToPriceReason(id);
      if (res.data) {
        const newRefusalToPriceContents = [
          ...refusalToPriceContents,
          { key: id, value: res.data.contentRefused || "Nội dung trống" },
        ];
        setRefusalToPriceContents(newRefusalToPriceContents);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 8) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    if (item.key === 1) {
      return {
        ...item,
        render: (climsCode: any, record: any) => (
          <>
            <Link
              to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
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
    if (item.key === 10) {
      return {
        ...item,
        render: (status: any, record: any) => {
          record.fileStatus === -1 ? (
            <div
              onMouseEnter={async () => {
                await handleGetRefusalToPriceContent(record.appraisalFileId);
              }}
            >
              <Tooltip
                title={
                  refusalToPriceContents.find(
                    (item) => item.key === record.appraisalFileId
                  )?.value || <Spin />
                }
              >
                <span className="files-status-label">
                  {renderAppraisalStatus(
                    status,
                    record?.isReceivedLos,
                    record?.sendToEmail,
                    record?.parentId,
                    record?.refusedStatus
                  )}
                </span>
              </Tooltip>
            </div>
          ) : (
            <span className="files-status-label">
              {renderAppraisalStatus(
                status,
                record?.isReceivedLos,
                record?.sendToEmail,
                record?.parentId,
                record?.refusedStatus
              )}
            </span>
          );
        },
      };
    }
    return { ...item };
  });

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelAll.exportExcell(
        configFilterAppraisalFile(filters)
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Bao_cao_tong_hop.xlsx");
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
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ tổng hợp?`,
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
                      if (!(filters.startDate && filters.endDate)) {
                        message.error(
                          "Vui lòng chọn từ ngày và đến ngày để xuất báo cáo!"
                        );
                      } else {
                        showConfirm();
                      }
                    }}
                    code={BUTTON_CODES.bcth_export}
                    disabled={exporting}
                  />
                </Space>
              </Col>
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={data ? data.data : []}
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
                scroll={{ x: 3000, y: 700 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Typography.Text strong>Tổng cộng</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}></Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                      <Table.Summary.Cell index={9}></Table.Summary.Cell>
                      <Table.Summary.Cell index={10}></Table.Summary.Cell>
                      <Table.Summary.Cell index={11}></Table.Summary.Cell>
                      <Table.Summary.Cell index={12}></Table.Summary.Cell>
                      <Table.Summary.Cell index={13}></Table.Summary.Cell>
                      <Table.Summary.Cell index={14}></Table.Summary.Cell>
                      <Table.Summary.Cell index={15}></Table.Summary.Cell>
                      <Table.Summary.Cell index={16}></Table.Summary.Cell>
                      <Table.Summary.Cell index={17} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.totalValue,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={18} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.feeTotal,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={19} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.feeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={20} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.oneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={21} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.twoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={22} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.twoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={23} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.twoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={24} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.notReceiveResults,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={25}></Table.Summary.Cell>
                      <Table.Summary.Cell index={26}></Table.Summary.Cell>
                      <Table.Summary.Cell index={27} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.reduceFeeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={28} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.reduceOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={29} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.reduceTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={30} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.reduceTwoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={31} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.reduceTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={32} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.totalReduceFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={33}></Table.Summary.Cell>
                      <Table.Summary.Cell index={34}></Table.Summary.Cell>
                      <Table.Summary.Cell index={35} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.internalRecordFeeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={36} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.internalRecordOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={37} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.internalRecordTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={38} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.internalRecordOneTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={39} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc +
                                  item.internalRecordTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={40} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.totalInternalRecord,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={41}></Table.Summary.Cell>
                      <Table.Summary.Cell index={42}></Table.Summary.Cell>
                      <Table.Summary.Cell index={43} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.returnFeeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={44} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.returnOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={45} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.returnTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={46} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.returnTwoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={47} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.returnTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={48} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.totalReturn,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={49}></Table.Summary.Cell>
                      <Table.Summary.Cell index={50}></Table.Summary.Cell>
                      <Table.Summary.Cell index={51} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.cashFeeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={52} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.cashOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={53} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.cashTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={54} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.cashTwoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={55} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.cashTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={56} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.totalCash,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={57} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.debtFeeBusiness,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={58} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.debtOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={59} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.debtTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={60} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.debtTwoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={61} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.debtTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={62} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.remainMustCash,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={63} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.cashSurplus,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={64}></Table.Summary.Cell>
                      <Table.Summary.Cell index={65} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.billOneTime,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={66}></Table.Summary.Cell>
                      <Table.Summary.Cell index={67} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) => acc + item.billTwoTime,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={68} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.ageDebtOneTime,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={69} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                  acc + item.ageDebtTwoTime,
                                0
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={70}></Table.Summary.Cell>
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

export default TableReportAll;
