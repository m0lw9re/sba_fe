import "./style.scss";
import { useState } from "react";
import PhieuThuFilter from "./PhieuThuFilter";
import PhieuThuTable from "./PhieuThuTable";
import { FilterCreateCollectSpent } from "constant/types";
import AddAndEditModal from "./ModalCreateEdit";

const PhieuThuInfo = () => {
  const [filter, setFilter] = useState<FilterCreateCollectSpent>({});
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
        <PhieuThuFilter filters={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <PhieuThuTable
          filter={filter}
          onAddNew={handleOpenAddModal}
          onEdit={handleOpenEditModal}
        />
      </div>
      <AddAndEditModal
        isOpen={openAddModal}
        onClose={handleCloseAddModal}
        action={modalType}
      />
    </div>
  );
};

export default PhieuThuInfo;
