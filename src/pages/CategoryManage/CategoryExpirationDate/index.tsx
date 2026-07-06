import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_EXPIRATION_DATE } from "routes/route.constant";
import CategoryExpirationDateTable from "./components/CategoryExpirationDateTable";
import { FilterCategoryExpirationDateType } from "constant/types/categoryExpirationDate";

const CategoryExpirationDate = () => {
  const [filter, setFilter] = useState<FilterCategoryExpirationDateType>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Cài đặt tham số hiệu lực",
        path: CATEGORY_EXPIRATION_DATE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_EXPIRATION_DATE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <CategoryExpirationDateTable filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default CategoryExpirationDate;
