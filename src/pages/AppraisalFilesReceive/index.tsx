import "./style.scss";
import React, { useEffect, useState } from "react";
import { APPRAISAL_FILES_RECEIVE } from "routes/route.constant";
import AppraisalFileReceiveTable from "./subcomponents/AppraisalFileReceiveTable";
import AppraisalFileReceiveFilter from "./subcomponents/AppraisalFileReceiveFilter";
import { FilterAppraisalFileType } from "constant/types";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

const AppraisalFilesReceiveUpdate = () => {
  const [filters, setFilters] = useState<FilterAppraisalFileType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ đến",
        path: APPRAISAL_FILES_RECEIVE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [APPRAISAL_FILES_RECEIVE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <AppraisalFileReceiveFilter
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        <AppraisalFileReceiveTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default AppraisalFilesReceiveUpdate;
