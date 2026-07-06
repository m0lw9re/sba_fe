import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ACCOUNTANT_DEBT_FOLLOW } from "routes/route.constant";
import Filter from "./components/Filter";
import Table from "./components/Table";
import "./style.scss";

const AccountantDebtFollow = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] =
    useState<FilterAccountantFeeNotificationsUpdate>({endDate: null, startDate: null});

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách theo dõi doanh thu, công nợ",
        path: ACCOUNTANT_DEBT_FOLLOW,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTANT_DEBT_FOLLOW]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <Table filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default AccountantDebtFollow;
