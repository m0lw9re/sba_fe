import React, { useEffect } from "react";
import FastAppraisalFileTable from "./subcomponent/FastAppraisalFileTable/FastAppraisalFileTable";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { FAST_APPRAISAL_FILES } from "routes/route.constant";

const FastAppraisalFiles = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Định giá nhanh",
        path: FAST_APPRAISAL_FILES,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [FAST_APPRAISAL_FILES])
  return (
    <div className="page-container">
      <FastAppraisalFileTable />
    </div>
  );
};

export default FastAppraisalFiles;
