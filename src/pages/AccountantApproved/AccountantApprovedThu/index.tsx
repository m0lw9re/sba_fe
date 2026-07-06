import "./style.scss";
import { useState } from "react";
import AccountantApproveThuFilter from "./AccountantApprovedThuFilter";
import AccountantApproveThuTable from "./AccountantApprovedThuTable";
import { FilterAccountantApprove } from "constant/types";

const AccountantApprovedInfo = () => {
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
        <AccountantApproveThuFilter filters={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <AccountantApproveThuTable
          filters={filter}
          onAddNew={handleOpenAddModal}
          onEdit={handleOpenEditModal}
        />
      </div>
    </div>
  );
};

export default AccountantApprovedInfo;
