import { Card, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  CategoryDayOffsType,
  FiltersCategoryDayOffsType,
} from "constant/types/categories";
import { CommonGetAllParams } from "constants/types/common.type";
import { defaultColumns } from "../table.config";
import { useState } from "react";
import { useCategoryDayOffs } from "utils/request";
import AddAndEditModal from "./AddAndEditModal/AddAndEditModal";
import "./style.scss";
import { categoryApi } from "apis/category";
import ComponentsError from "pages/ComponentsError";
import dayjs from "dayjs";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FiltersCategoryDayOffsType;
  setFilters: (filter: FiltersCategoryDayOffsType) => void;
};

const Index: React.FC<Props> = ({ filters, setFilters }) => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CategoryDayOffsType | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { data, isLoading, error, mutate } = useCategoryDayOffs(params, {
    ...filters,
    start: filters.start
      ? dayjs(filters?.start).format("DD-MM-YYYY 00:00:00")
      : null,
    end: filters.end ? dayjs(filters?.end).format("DD-MM-YYYY 23:59:59") : null,
  });

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleOpenEditModal = (record: CategoryDayOffsType) => {
    setOpenAddModal(true);
    setModalType("edit");
    setEditItem(record);
  };

  const handleSuccess = () => {
    handleCloseAddModal();
    mutate();
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await categoryApi.deleteDayOffs(id);
      if (res.status === 200) {
        message.success(res.data.message);
      }
      mutate();
    } catch (error: any) {
      message.error(error.message);
    }
    setLoading(false);
  };

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
    if (item.key === 5) {
      return {
        ...item,
        render: (_: any, record: CategoryDayOffsType) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => handleOpenEditModal(record)}
              removeFunction={() => handleDelete(record.holidayInYearId!)}
              removeButtonCode={BUTTON_CODES.dm_nntn_xoa}
              editButtonCode={BUTTON_CODES.dm_nntn_sua}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  if (error) return <ComponentsError />;

  return (
    <div className="page-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Ngày nghỉ trong năm" />
          <ButtonCustom
            label="Thêm mới ngày nghỉ"
            type="primary"
            onClick={() => handleOpenAddModal()}
            bgColor="rgba(40, 98, 175, 1)"
            code={BUTTON_CODES.dm_nntn_them}
          />
        </div>
        <TableCustom
          bordered={true}
          columns={columns}
          dataSource={data ? data.data.reverse() : []}
          isLoading={isLoading || loading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data?.total || 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
      </Card>

      <AddAndEditModal
        isOpen={openAddModal}
        onClose={handleCloseAddModal}
        modalType={modalType}
        editItem={editItem}
        onSuccess={handleSuccess}
        setLoading={setLoading}
      />
    </div>
  );
};

export default Index;
