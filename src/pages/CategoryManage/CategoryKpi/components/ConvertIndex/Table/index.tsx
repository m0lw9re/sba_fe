import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useState } from "react";
import { defaultColumns } from "./config";
import { useCategoryConvertIndex } from "utils/request";
import { Card, Row, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { categoryApi } from "apis/category";
import { useAppDispatch } from "configs/hooks";
import { setModalType, setRecord } from "../Store/CategoryKpiSlice";
import ComponentsError from "pages/ComponentsError";
import ModalConverIndex from "../Modal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { BUTTON_CODES } from "constant/common";

const ConvertIndex = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>();
  const dispatch = useAppDispatch();
  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const { data, isLoading, error, mutate } = useCategoryConvertIndex(
    params,
    filter
  );

  const handleOpenAddModal = () => {
    dispatch(setRecord(null));
    dispatch(setModalType("add"));
    //  dispatch(setKpiGroupId(null));
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    dispatch(setModalType(null));
    dispatch(setRecord(null));
  };
  const handleOpenEditModal = (record: any) => {
    setOpenAddModal(true);
    dispatch(setModalType("edit"));
    dispatch(setRecord(record));
  };
  const deleteRecord = async (record: any) => {
    try {
      await categoryApi.deleteConvertIndex(record?.id);
      message.success(`Đã xóa quy đổi hệ số hồ sơ`);
      mutate();
    } catch (error) {
      message.error(`Đã có lỗi khi xóa quy đổi hệ số hồ sơ`);
    }
  };
  const columns = defaultColumns.map((item: any) => {
    if (item.key === 1) {
      return {
        ...item,
        render: (value: any, record: any, index: any) => {
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
              editFunction={() => {
                handleOpenEditModal(record);
              }}
              removeFunction={() => {
                // message.info("Chức năng đang hoàn thiện");
                deleteRecord(record);
              }}
              removeButtonCode={BUTTON_CODES.dm_kpi_xoa}
              editButtonCode={BUTTON_CODES.dm_kpi_sua}
            />
          </>
        ),
      };
    } else return { ...item };
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
        <CardTitleCustomUpdate title="Danh sách quy đổi hồ sơ" />
        <ButtonCustom
          label="Thêm quy đổi"
          bgColor="#2862AF"
          onClick={handleOpenAddModal}
          type="primary"
          size="small"
          code={BUTTON_CODES.dm_kpi_them}
        />
      </div>
      {error ? (
        <ComponentsError />
      ) : (
        <TableCustom
          bordered={true}
          columns={columns}
          dataSource={data?.data}
          isLoading={isLoading}
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
      )}
      <ModalConverIndex
        isOpen={openAddModal}
        onClose={handleCloseAddModal}
        mutate={mutate}
      />
    </Card>
  );
};

export default ConvertIndex;
