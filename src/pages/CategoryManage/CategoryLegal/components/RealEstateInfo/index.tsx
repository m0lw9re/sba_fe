import "./style.scss";
import { Card } from "antd";
import { useState } from "react";
import RealEstateFilter from "./RealEstateFilter";
import { FilterRealEstateLegalType } from "constant/types";
import RealEstateTable from "./RealEstateTable";

const RealEstateInfo = () => {
  const [filter, setFilter] = useState<FilterRealEstateLegalType>({});
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <RealEstateFilter filter={filter} setFilter={setFilter} />
      </div>

      <div className="table-category">
        <RealEstateTable filter={filter} />
      </div>
    </div>
  );
};

export default RealEstateInfo;
