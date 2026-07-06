import { Space, Table, Tooltip, Typography } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.scss";
import { defaultColumns } from "./config";
import { FilterFollowReportsDebt, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import TableCustom from "components/TableCustom";
import { useReportsFollowDebt } from "utils/request";
import { numberUtils, randomId } from "utils";
import { Link } from "react-router-dom";
import {
  ACCOUNTANT_DEBT_DETAIL,
  APPRAISAL_FILE_DETAIL,
} from "routes/route.constant";
import { APPRAISAL_FILE_STATUS } from "constant/common";
import { toRoundNumber } from "utils/format";
import { configFilterAppraisalFile } from "utils/string";

type Props = {
  filters: FilterFollowReportsDebt;
  setFilters: (filters: FilterFollowReportsDebt) => void;
};

const TableFollowDebtReport: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error } = useReportsFollowDebt(
    params,
    configFilterAppraisalFile(filters)
  );

  const dataTable = data?.data
    ? data?.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

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
              to={ACCOUNTANT_DEBT_DETAIL.replace(":id", record.appraisalFileId)}
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
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={
                  data ? data.data.filter((el: any) => el.appraisalFileId) : []
                }
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
                scroll={{ x: 3000 }}
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
                      <Table.Summary.Cell index={12} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.feeTotal
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={13} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.feeBusiness
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={14} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.oneTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={15} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.twoTimeFeeConfirmed
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={16} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.twoTimeFeeUnconfimred
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={17} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.notReceiveResults
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={18}></Table.Summary.Cell>
                      <Table.Summary.Cell index={19}></Table.Summary.Cell>
                      <Table.Summary.Cell index={20}></Table.Summary.Cell>
                      <Table.Summary.Cell index={21} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.reduceFeeBusiness
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={22} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.reduceOneTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={23} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.reduceTwoTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={24} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.reduceTwoTimeFeeConfirmed
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={25} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.reduceTwoTimeFeeUnconfimred
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={26} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.totalReduceFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={27}></Table.Summary.Cell>
                      <Table.Summary.Cell index={28}></Table.Summary.Cell>
                      <Table.Summary.Cell index={29}></Table.Summary.Cell>
                      <Table.Summary.Cell index={30} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.internalRecordFeeBusiness
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={31} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.internalRecordOneTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={32} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.internalRecordTwoTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={33} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.internalRecordOneTimeFeeConfirmed
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={34} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.internalRecordTwoTimeFeeUnconfimred
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={35} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.totalInternalRecord
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={36}></Table.Summary.Cell>
                      <Table.Summary.Cell index={37}></Table.Summary.Cell>
                      <Table.Summary.Cell index={38}></Table.Summary.Cell>
                      <Table.Summary.Cell index={39} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.cashFeeBusiness
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={40} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.cashOneTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={41} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.cashTwoTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={42} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.cashTwoTimeFeeConfirmed
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={43} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.cashTwoTimeFeeUnconfimred
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={44} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.totalCash
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={45}></Table.Summary.Cell>
                      <Table.Summary.Cell index={46}></Table.Summary.Cell>
                      <Table.Summary.Cell index={47}></Table.Summary.Cell>
                      <Table.Summary.Cell index={48} align="right">
                        {/* <Typography.Text strong>
                          {dataTable && dataTable.length > 0
                            ? numberUtils.formatNumber(
                                dataTable.reduce(
                                  (acc: any, item: any) =>
                                   (item.returnFeeBusiness || 0),
                                  0
                                )
                              )
                            : ""}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={49} align="right">
                        {/* <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                 item.returnOneTimeFee,
                                0
                              )
                            )}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={50} align="right">
                        {/* <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                 item.returnTwoTimeFee,
                                0
                              )
                            )}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={51} align="right">
                        {/* <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                 item.returnTwoTimeFeeConfirmed,
                                0
                              )
                            )}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={52} align="right">
                        {/* <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>
                                 item.returnTwoTimeFeeUnconfimred,
                                0
                              )
                            )}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={53} align="right">
                        {/* <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              dataTable.reduce(
                                (acc: any, item: any) =>item.totalReturn,
                                0
                              )
                            )}
                        </Typography.Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={54}></Table.Summary.Cell>
                      <Table.Summary.Cell index={55} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.debtFeeBusiness
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={56} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.debtOneTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={57} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.debtTwoTimeFee
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={58} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.debtTwoTimeFeeConfirmed
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={59} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]
                                  ?.debtTwoTimeFeeUnconfimred
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={60} align="right">
                        <Typography.Text strong>
                          {dataTable &&
                            numberUtils.formatNumber(
                              toRoundNumber(
                                dataTable[dataTable.length - 1]?.remainMustCash
                              )
                            )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={61}></Table.Summary.Cell>
                      <Table.Summary.Cell index={62}></Table.Summary.Cell>
                      <Table.Summary.Cell index={63}></Table.Summary.Cell>
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

export default TableFollowDebtReport;
