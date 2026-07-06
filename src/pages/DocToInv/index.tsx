import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DOC_TO_INVOICING } from "routes/route.constant";
import FiltersDocToInv from "./FilterDocToInv";
import { FilterDocToInv } from "constant/types";
import TableDocToInv from "./TableDocToInv";

const DocToInv = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FilterDocToInv>({
    dateTo: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Kế toán",
        path: "",
      },
      {
        label: "Hồ sơ đủ điều kiện xuất hoá đơn",
        path: "DOC_TO_INVOICING",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [DOC_TO_INVOICING]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <FiltersDocToInv filters={filter} setFilters={setFilter} />
        </div>
        <div className="table-category">
          <TableDocToInv filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default DocToInv;
