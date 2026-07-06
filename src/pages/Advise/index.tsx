import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ADVISE } from "routes/route.constant";
import "./style.scss";
import { FilterAdviseType } from "constant/types";
import AdviseFilter from "./AdviseFilter";
import AdviseTable from "./AdviseTable";

const Advise = () => {
  const [filter, setFilter] = useState<FilterAdviseType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tư vấn",
        path: ADVISE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ADVISE]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          {/* <AdviseFilter filters={filter} setFilters={setFilter} /> */}
        </div>
        <div className="table-category">
          {/* <AdviseTable filters={filter} setFilters={setFilter} /> */}
        </div>
      </div>
    </div>
  );
};

export default Advise;
