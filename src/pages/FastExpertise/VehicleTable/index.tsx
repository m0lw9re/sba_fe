import React, {useRef} from "react";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {FAST_EXPERTISE_VEHICLE} from "routes/route.constant";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import Filter from "./Filter";
import VehicleTable from "./VehicleTable";
import {
  setAddressText,
  setAssetInfo,
  setDetailDoc,
  setListTSSS,
  setValueExpertise,
} from "../Store/fastExpertise";
import { FilterVehicle } from "constant/types";
const Vehicle = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<FilterVehicle>({});
  const filterRef = useRef<any>(null);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Xe",
        path: FAST_EXPERTISE_VEHICLE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [FAST_EXPERTISE_VEHICLE]);
  const onKeyDown = (e: any) => {
    filterRef?.current?.onKeyDown(e);
  };
  useEffect(() => {
    dispatch(setAddressText(null));
    dispatch(setDetailDoc(null));
    dispatch(setAssetInfo(null));
    dispatch(setListTSSS([]));
    dispatch(setValueExpertise(null));
  }, []);
  return (
    <div style={{width: "100%"}} onKeyDown={onKeyDown} tabIndex={0}>
      <div className="page-container">
        <div style={{marginBottom: "8px"}}>
          <Filter filters={filter}  setFilters={setFilter}/>
        </div>

        <div>
          <VehicleTable filters={filter} />
        </div>
      </div>
    </div>
  );
};
export default Vehicle;
