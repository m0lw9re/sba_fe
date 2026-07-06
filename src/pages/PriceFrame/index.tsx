import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_FRAME } from "routes/route.constant";
import PriceFrameFilter from "./PriceFrameFilter";
import PriceFrameTable from "./PriceFrameTable";

const PriceFrame = () => {
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Khung giá đất các tỉnh thành",
        path: PRICE_FRAME,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [PRICE_FRAME])
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <PriceFrameFilter filters={filter} setFilters={setFilter} />
        </div>
        <div className="table-category">
          <PriceFrameTable filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default PriceFrame;
