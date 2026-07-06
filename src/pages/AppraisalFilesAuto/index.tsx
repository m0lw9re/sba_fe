import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APPRAISAL_FILES_AUTO } from "routes/route.constant";

const AppraisalFilesAuto = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phân giao tự động",
        path: APPRAISAL_FILES_AUTO,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [APPRAISAL_FILES_AUTO])
    return (
      <div className="page-container">Trang phân giao tự động</div>
    );
  };
  
  export default AppraisalFilesAuto;
  