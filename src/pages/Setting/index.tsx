import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SETTING } from "routes/route.constant";

const Setting = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tích hợp",
        path: SETTING,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [SETTING])
  return (
      <div className="page-container">Trang tích hợp</div>
  );
};

export default Setting;
