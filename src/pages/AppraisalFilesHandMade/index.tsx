import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APPRAISAL_FILES_HANDMADE } from "routes/route.constant";

const AppraisalFilesHandMade = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phân giao thủ công",
        path: APPRAISAL_FILES_HANDMADE,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [APPRAISAL_FILES_HANDMADE])
    return (
      <div className="page-container">Trang phân giao thủ công</div>
    );
  };
  
  export default AppraisalFilesHandMade;
  