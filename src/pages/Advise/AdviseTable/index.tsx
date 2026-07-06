import { Button, Card, Space, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { CommonGetAllParams } from "constants/types/common.type";
import { useEffect, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { FilterAdviseType } from "constant/types";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns, data } from "./config";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils";
import Icons from "assets/icons";

type Props = {
  filters: FilterAdviseType;
  setFilters: (filters: FilterAdviseType) => void;
};

const AdviseTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });
  const [collapse, setCollapse] = useState<number>(1);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const dataTable = data
    ? data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 10) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <Space size={"middle"}>
            <Button
              type="link"
              disabled={record.approved !== null && record.approved}
              className="text-actions"
              onClick={() => {}}
              style={{ color: "#2862AF" }}
            >
              Định giá lại
            </Button>
          </Space>
        ),
      };
    }
    return { ...item };
  });

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách tư vấn định giá" />
      </div>
      <TableCustom
        dataSource={dataTable}
        columns={columns}
        bordered={true}
        //isLoading={!data && isLoading}
        isLoading={false}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        //total={data ? data.total : 0}
        total={5}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
      />
    </Card>
  );
};
export default AdviseTable;
