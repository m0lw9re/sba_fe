import { Card, Tooltip } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import {
  FilterSystemParamsType,
  SystemParamsType,
} from "constant/types/system";
import EditSystemParamsModal from "../EditSystemParamsModal";
import { useSystemParams } from "utils/request/useSystemParams";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";

type Props = {
  filter: FilterSystemParamsType;
  setFilters: (filters: FilterSystemParamsType) => void;
};
const SystemParamsTable: FC<Props> = ({ filter, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [isEditSystemParamsModalShow, SetIsEditSystemParamsModalShow] =
    useState(false);
  const [selectedParams, setSelectedParams] = useState<SystemParamsType>({});
  const closeEditSystemParamsModal = () => {
    SetIsEditSystemParamsModalShow(false);
  };
  const openEditSystemParamsModal = (record: SystemParamsType) => {
    SetIsEditSystemParamsModalShow(true);
    setSelectedParams(record);
  };
  const { data, isLoading, error, mutate } = useSystemParams(params, filter);
  const dataTable = data
    ? data.data.map((item: any) => {
      return {
        ...item,
        key: randomId(),
      };
    })
    : [];

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

  const columns: ColumnsType<SystemParamsType> = [
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
      title: "Nhóm",
      dataIndex: "systemParametersGroupName",
      align: "left",
      render: (group) => (
        <Tooltip title={group}>
          <div className="inline-text">{group}</div>
        </Tooltip>
      ),
    },
    {
      key: 3,
      title: "Tham số",
      dataIndex: "systemParametersName",
      align: "left",
      render: (parameters) => (
        <Tooltip title={parameters}>
          <div className="inline-text">{parameters}</div>
        </Tooltip>
      ),
    },
    {
      key: 4,
      title: "Giá trị",
      dataIndex: "value",
      align: "left",
      render: (value) => (
        <Tooltip title={value}>
          <div className="inline-text">{value}</div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <>
          <ListButtonActionUpdate
            editFunction={() => openEditSystemParamsModal(record)}
          />
        </>
      ),
    },
  ];

  if (error) return <ComponentsError />;

  return (
    <div className="categories-administratives-table-container">
      <EditSystemParamsModal
        isOpenModal={isEditSystemParamsModalShow}
        closeModal={closeEditSystemParamsModal}
        data={{
          id: selectedParams.id,
          systemParametersGroupId: selectedParams.systemParametersGroupId,
          systemParametersName: selectedParams.systemParametersName,
          value: selectedParams.value
        }}
        mutate={mutate}
      />
      <Card className="card-container" size="small">
        <CardTitleCustomUpdate title="Danh sách tham số hệ thống" />
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
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
      </Card>
    </div>
  );
};

export default SystemParamsTable;
