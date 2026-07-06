import { Table, TableColumnsType } from "antd";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { BUTTON_CODES } from "constant/common";
import {
  EditPGDType,
  TransactionOfficeType,
} from "constant/types/categorytransaction";
import { Fragment, useState } from "react";
import EditPGDModal from "../components/EditTransactionOfficeModal";

type Props = {
  transContent: Array<TransactionOfficeType>;
  branchOptions: Array<{ value: string; label: string }>;
  mutate: any;
};

const TransactionOfficeTable = ({
  transContent,
  branchOptions,
  mutate,
}: Props) => {
  const [selectedOffice, setSelectedOffice] = useState<EditPGDType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

  const handleOpenEditTransactionOfficeModal = (
    record: TransactionOfficeType
  ) => {
    if (!record) return;

    setSelectedOffice({
      transOfficeCode: record.transOfficeCode,
      transOfficeName: record.transOfficeName,
      address: record.address,
      email: record.email,
      phoneNumber: record.phoneNumber,
      branchCode: record.branchCode,
    });
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedOffice(undefined);
    setIsOpenEditModal(false);
    mutate();
  };

  const columns: TableColumnsType<TransactionOfficeType> = [
    {
      title: "Mã phòng giao dịch",
      dataIndex: "transOfficeCode",
      key: "transOfficeCode",
    },
    {
      title: "Tên phòng giao dịch",
      dataIndex: "transOfficeName",
      key: "transOfficeName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record: TransactionOfficeType) => (
        <ListButtonActionUpdate
          editFunction={() => handleOpenEditTransactionOfficeModal(record)}
          editButtonCode={BUTTON_CODES.dm_kv_them}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <Table
        columns={columns}
        bordered={true}
        size="small"
        dataSource={transContent}
        pagination={false}
        style={{ margin: "0.5rem 0" }}
      />
      <EditPGDModal
        isOpenModal={isOpenEditModal}
        closeModal={handleCloseEditModal}
        pgdSelected={selectedOffice}
        branchOptions={branchOptions}
      />
    </Fragment>
  );
};

export default TransactionOfficeTable;
