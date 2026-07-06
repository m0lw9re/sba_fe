import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORY_BUSSINESS_FEE } from "routes/route.constant";
import CategoriesBussinessFeeFilter from "./CategoriesBussinessFeeFilter";
import CategoriesBussinessFeeTable from "./CategoriesBussinessFeeTable";

const CategoriesAdministratives = () => {
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Công tác phí",
        path: CATEGORY_BUSSINESS_FEE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_BUSSINESS_FEE]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <CategoriesBussinessFeeFilter filters={filter} setFilters={setFilter} />
      </div>
      <CategoriesBussinessFeeTable
        filter={filter}
        setFilters={setFilter}
      />
    </div>
  );
};

export default CategoriesAdministratives;
