import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CONFIGCATEGORIES } from "routes/route.constant";

const Categories = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Cấu hình danh mục",
        path: CONFIGCATEGORIES,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [CONFIGCATEGORIES])

  return (
      <div className="page-container">Trang cấu hình danh mục</div>
  );
};

export default Categories;
