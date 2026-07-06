import "pages/AppraisalFiles/style.scss";
import { APPRAISAL_FILES } from "routes/route.constant";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import AppraisalFilesFilter from "./subcomponent/AppraisalFilesFilter";
import AppraisalFilesTable from "./subcomponent/AppraisalFilesTable";
import { FilterAppraisalFileType } from "constant/types/appraisalFile";

const AppraisalFile = () => {
  const [filters, setFilters] = useState<FilterAppraisalFileType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ tổng",
        path: APPRAISAL_FILES,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [APPRAISAL_FILES]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <AppraisalFilesFilter filters={filters} setFilters={setFilters} />
        </div>
        <AppraisalFilesTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default AppraisalFile;
