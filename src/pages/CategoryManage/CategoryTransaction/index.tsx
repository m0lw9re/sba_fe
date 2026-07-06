import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_TRANSACTION } from "routes/route.constant";
import CategoryTransactionFilter from "./CategoryTransactionFilter/CategoryTransactionFilter";
import CategoryTransactionTable from "./CategoryTransactionTable/CategoryTransactionTable";
import { FilterCategoryTransactionType } from "constant/types";

const CategoryTransaction = () => {
  const [filter, setFilter] = useState<FilterCategoryTransactionType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Danh sách khu vực/CN/PGD Sacombank",
        path: CATEGORY_TRANSACTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_TRANSACTION]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <CategoryTransactionFilter filters={filter} setFilter={setFilter} />
        </div>
        <div className="table-category">
          <CategoryTransactionTable filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default CategoryTransaction;
