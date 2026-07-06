import React, { useState } from "react";
import { Modal, Card, Row, message, Space } from "antd";
import "pages/CategoryManage/CategoryRegions/components/CreateCategoryRegionsModal/style.scss";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { EditPGDType, GetAllCommonType } from "constant/types";
import { useTransactionOfficeSacombank } from "utils/request";
import { defaultColumns } from "./config";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
// import CreatePGDModal from "./ModalCreate";
import { transactionsApi } from "apis/transactions";
// import EditPGDModal from "./ModalEdit";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  branchCode: string;
};

const ModalViewTransactionTable: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  branchCode,
}) => {
  const [isOpenCreatePGDModal, setIsOpenCreatePGDModal] =
    useState<boolean>(false);

  const [isOpenEditPGDModal, setIsOpenEditPGDModal] = useState<boolean>(false);

  const openCreatePGDModal = (branchCode: string) => {
    setIsOpenCreatePGDModal(true);
    setBranchCodeSelect(branchCode);
  };

  const closeCreatePGDModal = () => {
    setIsOpenCreatePGDModal(false);
    mutate();
  };

  const closeEditPGDModal = () => {
    setIsOpenEditPGDModal(false);
    mutate();
  };

  const [editPGDSelected, setEditPGDSelected] = useState<EditPGDType>();

  const [branchCodeSelect, setBranchCodeSelect] = useState("");

  const openEditPGDModal = (record: EditPGDType) => {
    setIsOpenEditPGDModal(true);
    setEditPGDSelected(record);
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const handleRemove = async (transOfficeCode: string) => {
    try {
      const response = await transactionsApi.deletePGD(transOfficeCode);
      if (response.data.code === 200) {
        message.success("Xoá phòng giao dịch thành công");
        mutate();
      } else message.error("Xoá phòng giao dịch thất bại!");
    } catch {
      message.error("Xoá phòng giao dịch thất bại!");
    }
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
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() =>
                openEditPGDModal({
                  transOfficeCode: record.transOfficeCode,
                  transOfficeName: record.transOfficeName,
                  address: record.address,
                  email: record.email,
                  phoneNumber: record.phoneNumber,
                  branchCode: record.branchCode,
                })
              }
              removeFunction={() => handleRemove(record.transOfficeCode)}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  const { data, isLoading, mutate } = useTransactionOfficeSacombank(branchCode);

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalViewTransaction"
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Row
        justify={"space-between"}
        align={"middle"}
        className="modalViewTransaction-header"
        style={{ width: "100%" }}
      >
        <Card className="card-container-modalviewtransaction" size="small">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <CardTitleCustomUpdate title="Danh sách Phòng giao dịch" />
            <ButtonCustom
              label="Thêm phòng giao dịch"
              type="primary"
              onClick={() => openCreatePGDModal(branchCode)}
              bgColor="rgba(40, 98, 175, 1)"
            />
          </div>

          <TableCustom
            bordered={true}
            columns={columns}
            dataSource={data}
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
          <Row justify={"end"} style={{ padding: "0" }} className="button-row">
            <Space>
              <ButtonCustom
                label="Đóng"
                onClick={() => {
                  closeModal();
                }}
              />
            </Space>
          </Row>
          {/* <CreatePGDModal
            isOpenModal={isOpenCreatePGDModal}
            closeModal={closeCreatePGDModal}
            branchCodeSelected={branchCodeSelect}
          />
          <EditPGDModal
            isOpenModal={isOpenEditPGDModal}
            closeModal={closeEditPGDModal}
            pgdSelected={editPGDSelected!}
            branchCodeSelected={branchCodeSelect}
          /> */}
        </Card>
      </Row>
    </Modal>
  );
};

export default ModalViewTransactionTable;
