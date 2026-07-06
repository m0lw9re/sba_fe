import {useRef, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {FAST_EXPERTISE_APARTMENT} from "routes/route.constant";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import Filter from "./Filter";
import ApartmentTable from "./ApartmentTable";
import {
  setAddressText,
  setAssetInfo,
  setDetailDoc,
  setListTSSS,
  setValueExpertise,
} from "../Store/fastExpertise";
const Apartment = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState();
  const filterRef = useRef<any>(null);
  
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Chung cư",
        path: FAST_EXPERTISE_APARTMENT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FAST_EXPERTISE_APARTMENT]);

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
          <ApartmentTable filters={filters}></ApartmentTable>
        </div>
      </div>
    </div>
  );
};
export default Apartment;
