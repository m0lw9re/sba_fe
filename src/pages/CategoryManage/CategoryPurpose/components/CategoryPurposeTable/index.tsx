import { Card, message } from "antd";
import TableCustom from "components/TableCustom";
import { CommonGetAllParams } from "constants/types/common.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { FilterCategoryPurposeType } from "constant/types";
import CreateCategoryPurposeModal from "../CreateCategoryPurposeModal";
import EditCategoryPurposeModal from "../EditCategoryPurposeModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { EditCategoryPurposeType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useCategoryPurpose } from "utils/request";
import { purposesApi } from "apis/purposes";
import CategoryPurposeFilter from "../CategoryPurposeFilter";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterCategoryPurposeType;
  setFilters: (filters: FilterCategoryPurposeType) => void;
};

const PurposeTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [
    isOpenCreateCategoryPurposeModal,
    setIsOpenCreateCategoryPurposeModal,
  ] = useState<boolean>(false);

  const [isOpenEditCategoryPurposeModal, setIsOpenEditCategoryPurposeModal] =
    useState<boolean>(false);

  const [editPurposeSelected, setEditPurposeSelected] =
    useState<EditCategoryPurposeType>();

  const openCreateCategoryPurposeModal = () => {
    setIsOpenCreateCategoryPurposeModal(true);
  };

  const closeCreateCategoryPurposeModal = () => {
    mutate();
    setIsOpenCreateCategoryPurposeModal(false);
  };

  const openEditCategoryPurposeModal = (record: EditCategoryPurposeType) => {
    setIsOpenEditCategoryPurposeModal(true);
    setEditPurposeSelected(record);
    mutate();
  };

  const closeEditCategoryPurposeModal = () => {
    mutate();
    setIsOpenEditCategoryPurposeModal(false);
  };

  const handleRemove = async (usingPurposeId: string) => {
    try {
      const response = await purposesApi.delete(usingPurposeId);
      // 05/01/2024 - haipham - #1041 - fix message error
      // if (response.data) {
      if (response.data && response.data.data !== null) {
        message.success("Xoá mục đích thành công");
        mutate();
        // 09/01/2024 - haipham - #1041 - update message error
      } else message.error("Không thể xoá mục đích đã được sử dụng!");
      // end
    } catch {
      message.error("Xoá mục đích thất bại!");
    }
  };

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryPurpose(params, {
    ...filters,
    status:
      filters?.status === true || filters?.status === false
        ? filters?.status.toString()
        : null,
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
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => openEditCategoryPurposeModal(record)}
              removeFunction={() => handleRemove(record.usingPurposeId)}
              editButtonCode={BUTTON_CODES.dm_mdsd_sua}
              removeButtonCode={BUTTON_CODES.dm_mdsd_xoa}
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
        <CategoryPurposeFilter
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
            <CardTitleCustomUpdate title="Danh sách mục đích sử dụng đất" />
            <ButtonCustom
              label="Thêm mục đích sử dụng"
              type="primary"
              onClick={openCreateCategoryPurposeModal}
              bgColor="rgba(40, 98, 175, 1)"
              code={BUTTON_CODES.dm_mdsd_them}
            />
          </div>

          <TableCustom
            bordered={true}
            columns={columns}
            dataSource={data ? data?.items : []}
            isLoading={!data && isLoading}
            limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
            total={data ? data?.total : 0}
            onLimitChange={(limit) => {
              setParams({ ...params, limit });
            }}
            onPageChange={(page) => {
              setParams({ ...params, page });
            }}
            page={params.page || 1}
          />
          <CreateCategoryPurposeModal
            isOpenModal={isOpenCreateCategoryPurposeModal}
            closeModal={closeCreateCategoryPurposeModal}
          />
          <EditCategoryPurposeModal
            isOpenModal={isOpenEditCategoryPurposeModal}
            closeModal={closeEditCategoryPurposeModal}
            purposeSelected={editPurposeSelected!}
          />
        </Card>
      </div>
    </>
  );
};

export default PurposeTable;
