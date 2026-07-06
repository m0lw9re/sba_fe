import { Card, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterHistoryAccessType } from "constant/types";
import { SystemLoginType } from "constant/types/system";
import { CommonGetAllParams } from "constants/types/common.type";
import dayjs from "dayjs";
import ComponentsError from "pages/ComponentsError";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHistoryAccess, useHistoryAccessFilter } from "utils/request";
import { randomId } from "utils/string";
import "./style.scss";

type Props = {
  filter: FilterHistoryAccessType;
  setFilters: (filters: FilterHistoryAccessType) => void;
};
const AccessHistoryTable: FC<Props> = ({ filter, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    if (filter.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilters({
        ...filter,
        isFiltering: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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

  const { data, isLoading, error } = useHistoryAccessFilter(params, filter);

  const dataTable = data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns: ColumnsType<SystemLoginType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      render: (_, record, index) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Thời gian",
      dataIndex: "loginTime",
      align: "left",
      render: (loginTime) => {
        const formateDateTime = dayjs(loginTime, {
          format: "DD-MM-YYYY HH:mm:ss",
        }).format("DD/MM/YYYY - HH:mm");
        return (
          <Tooltip title={formateDateTime}>
            <div className="inline-text">{formateDateTime}</div>
          </Tooltip>
        );
      },
    },
    {
      key: 3,
      title: "Tài khoản",
      dataIndex: "username",
      align: "left",
    },
    {
      key: 4,
      title: "Nhân viên",
      dataIndex: "clientInfo",
      align: "left",
    },
    {
      key: 5,
      title: "Địa điểm",
      dataIndex: "companyBranchName",
      align: "left",
    },
    {
      key: 6,
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      align: "left",
      render: (ipAddress) => (
        <Tooltip title={ipAddress}>
          <div className="inline-text">{ipAddress}</div>
        </Tooltip>
      ),
    },
  ];

  if (error)
    return (
      <div>
        <ComponentsError />
      </div>
    );

  return (
    <div className="categories-administratives-table-container">
      <Card className="card-container" size="small">
        <CardTitleCustomUpdate title="Lịch sử truy cập" />
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          //isLoading={!data && isLoading}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.total : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
        <div className="total-Page-AccessHistory">
          <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
            Tổng: {data?.total}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default AccessHistoryTable;
