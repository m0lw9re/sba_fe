import "./style.scss";
import React, { useEffect, useState } from "react";
import { RE_PRICING } from "routes/route.constant";
import RePricingTable from "./subcomponents/RePricingTable";
import RePricingFilter from "./subcomponents/RePricingFilter";
import { FilterAppraisalFileType } from "constant/types";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

const RePricing = () => {
  const [filters, setFilters] = useState<FilterAppraisalFileType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ tái định giá",
        path: RE_PRICING,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [RE_PRICING]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <RePricingFilter filters={filters} setFilters={setFilters} />
        </div>
        <RePricingTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default RePricing;
