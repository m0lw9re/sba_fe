import { Card, message } from "antd";
import TableCustom from "components/TableCustom";
import { CommonGetAllParams } from "constants/types/common.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import {
  CategoryExpirationDateType,
  CreateUpdateCategoryExpirationDateType,
  FilterCategoryExpirationDateType,
} from "constant/types/categoryExpirationDate";
import CreateCategoryExpirationDateModal from "../CreateCategoryExpirationDateModal";
import EditCategoryExpirationDateModal from "../EditCategoryExpirationDateModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useCategoryExpirationDate } from "utils/request";
import CategoryExpirationDateFilter from "../CategoryExpirationDateFilter";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";
import { categoryExpirationDateApi } from "apis/categoryExpirationDate";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: FilterCategoryExpirationDateType;
  setFilters: (filters: FilterCategoryExpirationDateType) => void;
};

const CategoryExpirationDateTable: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const { assetLevelOneData } = useSelector(
    (state: RootState) => state.globalSlice
  );
  console.log(assetLevelOneData);

  const [
    isOpenCreateCategoryExpirationDateModal,
    setIsOpenCreateCategoryExpirationDateModal,
  ] = useState<boolean>(false);

  const [
    isOpenEditCategoryExpirationDateModal,
    setIsOpenEditCategoryExpirationDateModal,
  ] = useState<boolean>(false);

  const [
    editCategoryExpirationDateSelected,
    setEditCategoryExpirationDateSelected,
  ] = useState<CreateUpdateCategoryExpirationDateType | null>();

  const openCreateCategoryExpirationDateModal = () => {
    setIsOpenCreateCategoryExpirationDateModal(true);
  };

  const closeCreateCategoryExpirationDateModal = () => {
    mutate();
    setIsOpenCreateCategoryExpirationDateModal(false);
  };

  const openEditCategoryExpirationDateModal = (
    record: CreateUpdateCategoryExpirationDateType
  ) => {
    setIsOpenEditCategoryExpirationDateModal(true);
    setEditCategoryExpirationDateSelected(record);
    mutate();
  };

  const closeEditCategoryExpirationDateModal = () => {
    mutate();
    setIsOpenEditCategoryExpirationDateModal(false);
  };

  const handleRemove = async (expirationDateId: number | null) => {
    try {
      if (!expirationDateId) return;
      const response = await categoryExpirationDateApi.deleteExpirationDate(
        expirationDateId
      );

      if (response.data && response.data.data !== null) {
        message.success("Xoá tham số hiệu lực thành công");
        mutate();
      } else
        message.error(
          response?.data?.message || "Xoá thời gian hiêu lực thất bại!"
        );
    } catch {
      message.error("Lỗi không xác định! Xoá tham số hiệu lực thất bại!");
    }
  };

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryExpirationDate(params, {
    ...filters,
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
    if (item.key === 2) {
      return {
        ...item,
        render: (value: any, record: CategoryExpirationDateType) => {
          const foundObj = assetLevelOneData.find(
            (el) => el.assetLevelOneId === value
          );
          return foundObj?.assetLevelOneName || value;
        },
      };
    }
    if (item.key === 4) {
      return {
        ...item,
        render: (_: any, record: CategoryExpirationDateType) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => openEditCategoryExpirationDateModal(record)}
              removeFunction={() => handleRemove(record.expirationDateId)}
              editButtonCode={BUTTON_CODES.dm_nhl_sua}
              removeButtonCode={BUTTON_CODES.dm_nhl_xoa}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  if (error) return <ComponentsError />;

  return (
    <>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <CategoryExpirationDateFilter
          filters={filters}
          setFilter={setFilters}
          onChangeData={(data) => setFilters({ ...data })}
        />
      </div>
      <div className="table-category">
        <Card className="card-container" size="small">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <CardTitleCustomUpdate title="Danh sách tham số hiệu lực" />
            <ButtonCustom
              label="Thêm tham số hiệu lực"
              type="primary"
              onClick={openCreateCategoryExpirationDateModal}
              bgColor="rgba(40, 98, 175, 1)"
              code={BUTTON_CODES.dm_nhl_them}
            />
          </div>

          <TableCustom
            bordered={true}
            columns={columns}
            dataSource={data ? data?.data?.data : []}
            isLoading={!data && isLoading}
            limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
            total={data ? data?.data?.total : 0}
            onLimitChange={(limit) => {
              setParams({ ...params, limit });
            }}
            onPageChange={(page) => {
              setParams({ ...params, page });
            }}
            page={params.page || 1}
          />
          <CreateCategoryExpirationDateModal
            isOpenModal={isOpenCreateCategoryExpirationDateModal}
            closeModal={closeCreateCategoryExpirationDateModal}
          />
          <EditCategoryExpirationDateModal
            isOpenModal={isOpenEditCategoryExpirationDateModal}
            closeModal={closeEditCategoryExpirationDateModal}
            expirationDateSelected={editCategoryExpirationDateSelected!}
          />
        </Card>
      </div>
    </>
  );
};

export default CategoryExpirationDateTable;
