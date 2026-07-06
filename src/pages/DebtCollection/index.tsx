import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DEBT_COLLECTION } from "routes/route.constant";
import "./style.scss";
import Filter from "./components/Filter";
import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
import Table from "./components/Table";

const AccountantFeeNotificationsUpdate = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterAccountantFeeNotificationsUpdate>({endDate: null, startDate: null});

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Doanh thu, công nợ",
        path: DEBT_COLLECTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [DEBT_COLLECTION]);

  //   useEffect(() => {
  //     setParams({ ...params, page: 1 });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [filters]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <Table filters={filters} setFilter={setFilters} />
    </div>
  );
};

export default AccountantFeeNotificationsUpdate;
