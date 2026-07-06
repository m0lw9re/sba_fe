import "./style.scss";
import { Card } from "antd";
import { useState } from "react";
import AccountantApproveChiFilter from "./AccountantApprovedChiFilter";
import AccountantApproveChiTable from "./AccountantApprovedChiTable";
import { FilterAccountantApprove } from "constant/types";

const AccountantApprovedChiInfo = () => {
  const [filter, setFilter] = useState<FilterAccountantApprove>({});
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "update" | null>(null);
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleOpenEditModal = () => {
    setOpenAddModal(true);
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <AccountantApproveChiFilter filters={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <AccountantApproveChiTable
          filters={filter}
          onAddNew={handleOpenAddModal}
          onEdit={handleOpenEditModal}
        />
      </div>
    </div>
  );
};

export default AccountantApprovedChiInfo;
