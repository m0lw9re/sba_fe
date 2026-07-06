import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORIES_ADMINISTRATIVES } from "routes/route.constant";
import CategoriesAdministrativesFilter from "./CategoriesAdministrativesFilter";
import CategoriesAdministrativesTable from "./CategoriesAdministativesTable";
import { CategoriesAdministrativesType } from "constant/types/categories";
import EditCategoriesAdministrativesModal from "./EditCategoriesAdministrativesModal";

const CategoriesAdministratives = () => {
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch();
  const [editCatAdministrativeItem, setEditCatAdministrativeItem] = useState<CategoriesAdministrativesType>({});
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
    setModalType('add');
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleOpenEditModal = (province: string, district: string, ward: string, road: string) => {
    setOpenAddModal(true);
    setModalType('edit');
    const catAdministrativeItem: CategoriesAdministrativesType = {
      province: province,
      district: district,
      ward: ward,
      road: road
    }
    setEditCatAdministrativeItem(catAdministrativeItem);
  };
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Địa bàn hành chính",
        path: CATEGORIES_ADMINISTRATIVES,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [CATEGORIES_ADMINISTRATIVES])
  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <CategoriesAdministrativesFilter filters={filter} setFilters={setFilter} />
      </div>
      <CategoriesAdministrativesTable
        filter={filter}
        onAddNew={handleOpenAddModal}
        onEdit={handleOpenEditModal}
      />
      <EditCategoriesAdministrativesModal
        isOpenModal={openAddModal}
        closeModal={handleCloseAddModal}
        province={editCatAdministrativeItem.province || null}
        district={editCatAdministrativeItem.district || null}
        ward={editCatAdministrativeItem.ward || null}
        road={editCatAdministrativeItem.road || null}
        modalType={modalType}
      />
    </div>
  );
};

export default CategoriesAdministratives;
