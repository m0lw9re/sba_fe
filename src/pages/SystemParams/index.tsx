import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SYSTEM_PARAMETERS } from "routes/route.constant";
import SystemParamsFilter from "./SystemParamsFilter";
import SystemParamsTable from "./SystemParamsTable";

const SystemParams = () => {
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hệ thống",
        path: "",
      },
      {
        label: "Tham số hệ thống",
        path: SYSTEM_PARAMETERS,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [SYSTEM_PARAMETERS])
  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <SystemParamsFilter filters={filter} setFilters={setFilter} />
      </div>
      <SystemParamsTable filter={filter} setFilters={setFilter}/>
    </div>
  );
};

export default SystemParams;
