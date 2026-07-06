import React, { useEffect } from "react";
import "pages/Statistic/style.scss";
import { STATISTIC } from "routes/route.constant";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

const Statistic = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Trang thống kê",
        path: STATISTIC,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [STATISTIC])
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container"></div>
    </div>
  );
};

export default Statistic;
