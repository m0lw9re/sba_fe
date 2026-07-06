import { Card, Tooltip, Typography, Table } from "antd";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterFollowDebtByStaff, GetAllCommonType } from "constant/types";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import "./style.scss";
import { useReportsFollowDGV } from "utils/request";
import { defaultColumns } from "./config";
import { numberUtils, randomId } from "utils";
import { Link } from "react-router-dom";
import { ACCOUNTANT_DEBT_DETAIL } from "routes/route.constant";
import { toRoundNumber } from "utils/format";

type Props = {
  filters: FilterFollowDebtByStaff;
  setFilters: (filters: FilterFollowDebtByStaff) => void;
};

const TableFollowDebtByStaff: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useReportsFollowDGV(
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

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 2) {
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

  return (
    <Card className="account-debt-follow-card-container" size="small">
      <TableCustom
        dataSource={
          data ? data.data.filter((el: any) => el.appraisalFileId) : []
        }
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
        scroll={{ x: 1980 }}
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
            <Table.Summary.Cell index={7} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={8} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={9} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={10} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(dataTable[dataTable.length - 1]?.totalFee)
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={11} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(
                      dataTable[dataTable.length - 1]?.noReceiveResult
                    )
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={12} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(dataTable[dataTable.length - 1]?.reduceFee)
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={13} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(
                      dataTable[dataTable.length - 1]?.totalInternalRecord
                    )
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(dataTable[dataTable.length - 1]?.totalCashed)
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={15} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(dataTable[dataTable.length - 1]?.totalReturn)
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={16} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={17} align="right">
              <Typography.Text strong>
                {dataTable &&
                  numberUtils.formatNumber(
                    toRoundNumber(dataTable[dataTable.length - 1]?.conPhaiThu)
                  )}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={18} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={19} align="right"></Table.Summary.Cell>
            <Table.Summary.Cell index={20} align="right"></Table.Summary.Cell>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default TableFollowDebtByStaff;