import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ACCOUNTANT_COLLECT_SPENT } from "routes/route.constant";
import "./style.scss";
import Filter from "./components/Filter";
import { FilterAccountantCollectSpent } from "constant/types";
import Table from "./components/Table";

const AccountantCollectSpent = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterAccountantCollectSpent>({});

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Các khoản thu chi",
        path: ACCOUNTANT_COLLECT_SPENT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTANT_COLLECT_SPENT]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <Table filters={filters} setFilter={setFilters} />
    </div>
  );
};

export default AccountantCollectSpent;
