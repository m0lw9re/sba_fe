import {useRef, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {FAST_EXPERTISE_LAND_TOWNHOUSE} from "routes/route.constant";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import Filter from "./Filter";
import LandTownHouseTable from "./LandTable";
import './style.scss';
import {
  setAddressText,
  setAssetInfo,
  setDetailDoc,
  setListTSSS,
  setValueExpertise,
} from "../Store/fastExpertise";
const LandTownHouse = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState();
  const filterRef = useRef<any>(null);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Nhà phố - Đất ở",
        path: FAST_EXPERTISE_LAND_TOWNHOUSE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FAST_EXPERTISE_LAND_TOWNHOUSE]);
  const onKeyDown = (e: any) => {
    filterRef?.current?.onKeyDown(e);
  };
  useEffect(() => {
    dispatch(setAddressText(null));
    dispatch(setDetailDoc(null));
    dispatch(setAssetInfo(null));
    dispatch(setListTSSS([]));
    dispatch(setValueExpertise(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{width: "100%"}} onKeyDown={onKeyDown} tabIndex={0}>
      <div className="page-container">
        <div style={{marginBottom: "8px"}}>
          <Filter ref={filterRef} setFilters={setFilters}></Filter>
        </div>
        <div>
          <LandTownHouseTable filters={filters}></LandTownHouseTable>
        </div>
      </div>
    </div>
  );
};
export default LandTownHouse;
