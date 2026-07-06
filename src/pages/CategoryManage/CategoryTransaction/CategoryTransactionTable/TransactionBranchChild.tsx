import { Table, TableColumnsType } from "antd";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { BUTTON_CODES } from "constant/common";
import {
  EditCategoryTransactionType,
  TransactionBranchType,
} from "constant/types/categorytransaction";
import TransactionOfficeTable from "pages/CategoryManage/CategoryTransaction/CategoryTransactionTable/TransactionOfficeChild";
import { Fragment, useState } from "react";
import EditCategoryTransactionModal from "pages/CategoryManage/CategoryTransaction/components/EditTransactionBranchModal";
type Props = {
  transContent: TransactionBranchType[];
  branchOptions: Array<{ value: string; label: string }>;
  mutate: any;
};

const TransactionBranchTable = ({
  transContent,
  branchOptions,
  mutate,
}: Props) => {
  const [selectedBranch, setSelectedBranch] =
    useState<EditCategoryTransactionType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

  const handleOpenEditTransactionBranchModal = (
    record: TransactionBranchType
  ) => {
    if (!record) return;

    setSelectedBranch({
      branchCode: record.branchCode,
      branchName: record.branchName,
      address: record.address,
      email: record.email,
      phoneNumber: record.phoneNumber,
      regionCode: record.regionCode,
    });
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedBranch(undefined);
    setIsOpenEditModal(false);
    mutate();
  };

  const columns: TableColumnsType<TransactionBranchType> = [
    { title: "Mã chi nhánh", dataIndex: "branchCode", key: "branchCode" },
    { title: "Tên chi nhánh", dataIndex: "branchName", key: "branchName" },
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
      render: (_, record: TransactionBranchType) => (
        <ListButtonActionUpdate
          editFunction={() => handleOpenEditTransactionBranchModal(record)}
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
        expandable={{
          expandedRowRender: (record) => (
            <TransactionOfficeTable
              transContent={record.transactionOffices}
              branchOptions={branchOptions}
              mutate={mutate}
            />
          ),
        }}
        rowKey="branchCode"
      />

      <EditCategoryTransactionModal
        isOpenModal={isOpenEditModal}
        closeModal={handleCloseEditModal}
        branchSelected={selectedBranch}
      />
    </Fragment>
  );
};

export default TransactionBranchTable;
