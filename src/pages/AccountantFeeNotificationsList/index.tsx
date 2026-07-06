import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ACCOUNTANT_FEE_NOTIFICATIONS_LIST } from "routes/route.constant";
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
        label: "Lập thông báo phí",
        path: ACCOUNTANT_FEE_NOTIFICATIONS_LIST,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTANT_FEE_NOTIFICATIONS_LIST]);

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
