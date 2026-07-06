import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { defaultColumns } from "./config";
import { Card, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { StaffType } from "constant/types";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";
import { useListFunction } from "utils/request";

const ListFunctionTable = () => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useListFunction(params);

  const prevParamsRef = useRef<any>(params);

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
    if (item.key === 1) {
      return {
        ...item,
        render: (_: any, record: any, index: number) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    } else
      return {
        ...item,
      };
  });

  if (error) return <ComponentsError />;

  return (
    <Card className="card-container" size="small">
      <CardTitleCustomUpdate title="Danh sách chức năng" />
      <div style={{ marginBottom: "4px" }}>
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
        />
        <div className="total-Page-DSCNTK">
          <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
            Tổng: {data?.total}
          </Typography.Text>
        </div>
      </div>
    </Card>
  );
};

export default ListFunctionTable;
