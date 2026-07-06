import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CADRES } from "routes/route.constant";

const Cadres = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách cán bộ",
        path: CADRES,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [CADRES])
  return (
      <div className="page-container">Trang danh sách cán bộ</div>
  );
};

export default Cadres;
