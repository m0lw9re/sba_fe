import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_PURPOSE } from "routes/route.constant";
import PurposeTable from "./components/CategoryPurposeTable";
import { FilterCategoryPurposeType } from "constant/types";

const CategoryPurpose = () => {
  const [filter, setFilter] = useState<FilterCategoryPurposeType>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Mục đích sử dụng đất",
        path: CATEGORY_PURPOSE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_PURPOSE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <PurposeTable filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default CategoryPurpose;
