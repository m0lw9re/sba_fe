import { Card, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { useCategoryCommit } from "utils/request/useCategoryCommit";
import { EditCategoryCommit, FilterCategoryCommit, GetAllCommonType } from "constant/types";
import CreateCategoryCommitModal from "../CreateNumberCommit";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ComponentsError from "pages/ComponentsError";
import { commitApi } from "apis/commit";
import EditCategoryCommitModal from "../EditNumberCommit";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterCategoryCommit;
  setFilters: (filters: FilterCategoryCommit) => void;
};

const CategoryCommitTable: React.FC<Props> = ({ filters, setFilters }) => {

  const [isOpenCreateCategoryCommitModal, setIsOpenCreateCategoryCommitModal] =
    useState<boolean>(false);

  const [isOpenEditCategoryCommitModal, setIsOpenEditCategoryCommitModal] =
    useState<boolean>(false);

  const openCreateCategoryCommitModal = () => {
    setIsOpenCreateCategoryCommitModal(true);
  };

  const closeCreateCategoryCommitModal = () => {
    setIsOpenCreateCategoryCommitModal(false);
    mutate();
  };

  const openEditCategoryCommitModal = (record: EditCategoryCommit) => {
    setIsOpenEditCategoryCommitModal(true);
    setEditCommitSelected(record);
    mutate();
  };

  const closeEditCategoryCommitModal = () => {
    mutate();
    setIsOpenEditCategoryCommitModal(false);
  };

  const [editCommitSelected, setEditCommitSelected] = useState<EditCategoryCommit>();

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const handleRemove = async (id: number) => {
    try {
      const response = await commitApi.delete(id);
      if (response.data.code === 200) {
        message.success("Xoá số ngày cam kết thành công");
        mutate();
      } else message.error("Xoá số ngày cam kết thất bại!");
    } catch {
      message.error("Xoá số ngày cam kết thất bại!");
    }
  };

  const { data, isLoading, error, mutate } = useCategoryCommit(params, filters);

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
              editFunction={() =>
                openEditCategoryCommitModal({
                  id: record.id,
                  assetTypeId: record.assetTypeId,
                  date: record.date,
                })
              }
              removeFunction={() => handleRemove(record.id)}
              removeButtonCode={BUTTON_CODES.dm_snck_xoa}
              editButtonCode={BUTTON_CODES.dm_snck_sua}
            />
          </>
        ),
      };
    }
    return { ...item };
  });
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
        <CardTitleCustomUpdate title="Danh sách số ngày cam kết" />
        <ButtonCustom
          label="Thêm số ngày cam kết"
          type="primary"
          onClick={openCreateCategoryCommitModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_snck_them}
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
      <CreateCategoryCommitModal
        isOpenModal={isOpenCreateCategoryCommitModal}
        closeModal={closeCreateCategoryCommitModal}
      />
      <EditCategoryCommitModal
        isOpenModal={isOpenEditCategoryCommitModal}
        closeModal={closeEditCategoryCommitModal}
        commitSelected={editCommitSelected!}
      />
    </Card>
  );
};

export default CategoryCommitTable;
