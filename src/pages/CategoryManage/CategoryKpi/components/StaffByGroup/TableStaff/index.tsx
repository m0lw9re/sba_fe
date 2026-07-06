import { Card, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "./style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { defaultColumns } from "./config";
import { FilterCategoryKpis, StaffByGroup } from "constant/types";
import ModalAddStaffKPI from "../Modal";
import { useEmplKPIs } from "utils/request";
import { groupKpis } from "apis/groupKpis";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterCategoryKpis;
  setFilter: (filter: FilterCategoryKpis) => void;
};
const StaffByGroups: FC<Props> = ({ filter, setFilter }) => {

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useEmplKPIs(params, filter); 

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<StaffByGroup | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);

  const [loading, setLoading] = useState<boolean>(false);


  const handleOpenAddModal = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleOpenEditModal = (record: StaffByGroup) => {
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
      const res = await groupKpis.deleteEmployee(id);
      if (res.status === 200) {
        message.success(res.data.message);
      }
      mutate();
    } catch (error: any) {
      message.error(error.message);
    }
    setLoading(false);
  };

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilter({
      ...filter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filter)]);

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
              editFunction={() => handleOpenEditModal(record)}
              removeFunction={() => handleDelete(record.id!)}
              removeButtonCode={BUTTON_CODES.dm_kpi_xoa}
              editButtonCode={BUTTON_CODES.dm_kpi_sua}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  // const changeFormData = (data: any) => {
  //   form.setValues({ ...form.values, ...data });
  // };

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách nhân viên thuộc nhóm" />
        <ButtonCustom
          label="Thêm nhân viên"
          type="primary"
          onClick={() => handleOpenAddModal()}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_kpi_them}
        />
      </div>
      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data ? data.data : []}
        isLoading={isLoading || loading}
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
      <ModalAddStaffKPI
        isOpen={openAddModal}
        onClose={handleCloseAddModal}
        modalType={modalType}
        onSuccess={handleSuccess}
        setLoading={setLoading}
        editItem={editItem}
      />
    </Card>
  );
};

export default StaffByGroups;
