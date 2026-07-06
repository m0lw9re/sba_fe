import { Card, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import {
  GetAllCommonType,
  CategoryConstructionType,
  FilterCategoryConstructionType,
} from "constant/types";
import CreateCategoryConstructionModal from "../CreateCategoryConstructionModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ComponentsError from "pages/ComponentsError";
import type { ColumnsType } from "antd/es/table";
import { useCategoryConstruction } from "utils/request";
import { numberUtils } from "utils";

type Props = {
  filters: FilterCategoryConstructionType;
  setFilters: (filters: FilterCategoryConstructionType) => void;
};

const CategoryConstructionTable: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [
    isOpenCreateCategoryConstructionModal,
    setIsOpenCreateCategoryConstructionModal,
  ] = useState<boolean>(false);

  const openCreateCategoryConstructionModal = () => {
    setIsOpenCreateCategoryConstructionModal(true);
  };

  const closeCreateCategoryConstructionModal = () => {
    mutate();
    setIsOpenCreateCategoryConstructionModal(false);
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryConstruction(
    params,
    filters
  );

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
      isFiltering: false,
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

  const columns: ColumnsType<CategoryConstructionType> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "",
      align: "center",
      width: "5%",
      render: (_: any, record, index: any) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Mô tả đặc tính kỹ thuật",
      dataIndex: "constructionName",
    },
    {
      key: 3,
      title: "Loại công trình xây dựng",
      dataIndex: "constructionTypeName",
    },
    {
      key: 4,
      title: "Giá (vnđ)",
      dataIndex: "",
      render: (_: any, record: CategoryConstructionType) => {
        return `${numberUtils.formatNumber(
          record.lowPrice
        )} - ${numberUtils.formatNumber(record.highPrice)}`;
      },
    },
  ];

  if (error) return <ComponentsError />;

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách mô tả đặc tính kỹ thuật" />
        <ButtonCustom
          label="Thêm mô tả đặc tính kỹ thuật"
          type="primary"
          onClick={openCreateCategoryConstructionModal}
          bgColor="rgba(40, 98, 175, 1)"
        />
      </div>

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
      <div className="total-Page-Risk">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <CreateCategoryConstructionModal
        isOpenModal={isOpenCreateCategoryConstructionModal}
        closeModal={closeCreateCategoryConstructionModal}
      />
    </Card>
  );
};

export default CategoryConstructionTable;
