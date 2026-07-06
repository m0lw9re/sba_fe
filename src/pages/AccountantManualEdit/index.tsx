import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ACCOUNTANT_MANUAL_EDIT } from "routes/route.constant";
import Filter from "./components/Filter";
import Table from "./components/Table";
import "./style.scss";

const AccountantManualEdit = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] =
    useState<FilterAccountantFeeNotificationsUpdate>({endDate: null, startDate: null});

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Sửa Phí Thủ công",
        path: ACCOUNTANT_MANUAL_EDIT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTANT_MANUAL_EDIT]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <Table filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default AccountantManualEdit;
