import { Card, Tooltip, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import ButtonCustom from "components/ButtonCustom";
import { useSystemFast } from "utils/request/useSystemFastRealEstate";
import { SystemFastExpertiseRealEstate } from "constant/types/system";
import EditSysFastRealPurposeModal from "../EditSysFastRealPurposeModal";
import { systemApi } from "apis/system";
import ComponentsError from "pages/ComponentsError";

const SysFastRealPurposeTable = () => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [editSysFastRealPositionItem, setEditSysFastRealPositionItem] =
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
  const handleEdit = (
    id: number,
    type?: number,
    typeName?: string,
    rateId?: number,
    rateName?: string,
    ratePerMain?: number,
    description?: string
  ) => {
    setOpenAddModal(true);
    setModalType("edit");
    const sysFastRealPositionItem: SystemFastExpertiseRealEstate = {
      id: id,
      type: type,
      typeName: typeName,
      rateId: rateId,
      rateName: rateName,
      ratePerMain: ratePerMain,
      description: description,
    };
    setEditSysFastRealPositionItem(sysFastRealPositionItem);
  };

  const { data, error, isLoading, mutate } = useSystemFast(params, { type: 1 });
  const handleDelete = async (id: string) => {
    try {
      const res = await systemApi.deleteFastExpRealEstate(id);
      if (res.data.code === 200) {
        message.success("Xóa thành công");
        mutate();
      } else message.error("Xóa thất bại");
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

  const columns: ColumnsType<SystemFastExpertiseRealEstate> = [
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
      title: "Mục đích sử dụng",
      dataIndex: "rateName",
      align: "left",
      render: (rateName) => (
        <Tooltip title={rateName}>
          <div className="inline-text">{rateName}</div>
        </Tooltip>
      ),
    },
    {
      key: 3,
      title: "Tỉ lệ so với đất ở tại đô thị",
      dataIndex: "ratePerMain",
      align: "left",
      render: (ratePerMain) => (
        <Tooltip title={ratePerMain}>
          <div className="inline-text">{ratePerMain}</div>
        </Tooltip>
      ),
    },

    {
      key: 4,
      title: "Mô tả",
      dataIndex: "description",
      align: "left",
      render: (description) => (
        <Tooltip title={description}>
          <div className="inline-text">{description}</div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "",
      align: "center",
      render: (_, record: any) => (
        <>
          <ListButtonActionUpdate
            editFunction={() =>
              handleEdit(
                record.id,
                record.type,
                record.typeName,
                record.rateId,
                record.rateName,
                record.ratePerMain,
                record.description
              )
            }
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
          <CardTitleCustomUpdate title="Mục đích sử dụng" />
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
      <EditSysFastRealPurposeModal
        isOpenModal={openAddModal}
        closeModal={handleCloseAddModal}
        modalType={modalType}
        realEstatePurpose={editSysFastRealPositionItem}
        mutate={mutate}
      />
    </div>
  );
};

export default SysFastRealPurposeTable;
