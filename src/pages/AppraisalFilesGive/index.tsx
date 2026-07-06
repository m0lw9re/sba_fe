import React, { useEffect, useState } from "react";
import { APPRAISAL_FILES_GIVE } from "routes/route.constant";
import { FilterAppraisalFileType } from "constant/types";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import AppraisalFileGiveFilter from "pages/AppraisalFilesGive/subcomponents/AppraisalFileGiveFilter";
import AppraisalFileGiveTable from "pages/AppraisalFilesGive/subcomponents/AppraisalFileGiveTable";

const AppraisalFilesGiveUpdate = () => {
  const [filters, setFilters] = useState<FilterAppraisalFileType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ đi",
        path: APPRAISAL_FILES_GIVE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [APPRAISAL_FILES_GIVE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <AppraisalFileGiveFilter filters={filters} setFilters={setFilters} />
        </div>
        <AppraisalFileGiveTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default AppraisalFilesGiveUpdate;
