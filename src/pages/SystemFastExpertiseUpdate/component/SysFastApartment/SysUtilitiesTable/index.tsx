import { Card, Tooltip, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import ButtonCustom from "components/ButtonCustom";
import {
  SystemFastExpertiseRealEstate,
  UtilityComboType,
} from "constant/types/system";
import EditSysUtilitiesTableModal from "../EditSysUtilitiesTableModal";
import { systemApi } from "apis/system";
import ComponentsError from "pages/ComponentsError";
import { useSystemUtilitiesCombo } from "utils/request";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

const SysUtilitiesTable = () => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [editSysUtilityComboItem, setEditSysUtilityComboItem] =
    useState<SystemFastExpertiseRealEstate>({});
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const handleCreate = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleEdit = (record: any) => {
    setOpenAddModal(true);
    setModalType("edit");
    const sysFastRealPositionItem = {
      id: record.id,
      name: record.name,
      utilityIds: record.utilityIds || [],
      rate: record.rate,
    };
    setEditSysUtilityComboItem(sysFastRealPositionItem);
  };

  const { data, error, isLoading, mutate } = useSystemUtilitiesCombo(params);
  const { utilitiesOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await systemApi.deleteUtilityCombo(id);
      if (res.data.code === 200) {
        message.success("Xóa combo tiện ích thành công");
        mutate();
      } else message.error("Xóa combo tiện ích thất bại");
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const dataTable = data?.data
    ? data?.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

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

  const columns: ColumnsType<UtilityComboType> = [
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
      title: "Nhóm tiện ích",
      dataIndex: "name",
      align: "left",
    },
    {
      key: 3,
      title: "Tiện ích",
      dataIndex: "utilityIds",
      align: "left",
      render: (utilityIds) => {
        const arrLabel: string[] = [];
        utilityIds?.forEach((el: string) => {
          const foundObj = utilitiesOptions.find(
            (item) => item.value.toString() === el
          );
          if (foundObj) arrLabel.push(foundObj.label);
        });

        return arrLabel.join(", ");
      },
    },
    {
      key: 4,
      title: "Tham số tiện ích",
      dataIndex: "rate",
      align: "left",
    },
    {
      key: 5,
      title: "",
      align: "center",
      render: (_, record: any) => (
        <>
          <ListButtonActionUpdate
            editFunction={() => handleEdit(record)}
            removeFunction={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];
  if (error) return <ComponentsError />;
  return (
    <div className="categories-administratives-table-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Cấu hình tiện ích" />
          <ButtonCustom
            label="Thêm"
            type="primary"
            onClick={handleCreate}
            bgColor="rgba(40, 98, 175, 1)"
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.totalCount : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
      </Card>
      <EditSysUtilitiesTableModal
        isOpenModal={openAddModal}
        closeModal={handleCloseAddModal}
        modalType={modalType}
        utilityCombo={editSysUtilityComboItem}
        mutate={mutate}
      />
    </div>
  );
};

export default SysUtilitiesTable;
