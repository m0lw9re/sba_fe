import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SYSTEM_LOGIN } from "routes/route.constant";
import AccessHistoryFilter from "./AccessHistoryFilter";
import AccessHistoryTable from "./AccessHistoryTable";

const AccessHistory = () => {
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hệ thống",
        path: "",
      },
      {
        label: "Lịch sử truy cập",
        path: SYSTEM_LOGIN,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [SYSTEM_LOGIN]);
  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <AccessHistoryFilter filters={filter} setFilters={setFilter} />
      </div>
      <AccessHistoryTable filter={filter} setFilters={setFilter}/>
    </div>
  );
};

export default AccessHistory;
