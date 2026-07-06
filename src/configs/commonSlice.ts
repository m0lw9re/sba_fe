import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addressApi } from "apis/adress";
import { categoryApi } from "apis/category";
interface State {
  listContructionTypes: any[];
  listProvince: any[];
  listDistrict: any[];
  listWard: any[];
  listPosition: any[];
  listRoadContiguousTypes: any[];
  listProjectApartment: any[];
  listBuildingApartment: any[];
  listBlockApartment: any[];
}

const initialState: State = {
  listContructionTypes: [],
  listProvince: [],
  listDistrict: [],
  listWard: [],
  listPosition: [],
  listRoadContiguousTypes: [],
  listProjectApartment: [],
  listBuildingApartment: [],
  listBlockApartment: [],
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setListContructionTypes: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.listContructionTypes = action.payload;
    },
    setListProvince: (state = initialState, action: PayloadAction<any>) => {
      state.listProvince = action.payload;
    },
    setListDistrict: (state = initialState, action: PayloadAction<any>) => {
      state.listDistrict = action.payload;
    },
    setListWard: (state = initialState, action: PayloadAction<any>) => {
      state.listWard = action.payload;
    },
    setListPosition: (state = initialState, action: PayloadAction<any>) => {
      state.listPosition = action.payload;
    },
    setListRoadContiguousTypes: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.listRoadContiguousTypes = action.payload;
    },
    setListProjectApartment: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.listProjectApartment = action.payload;
    },
    setListBuildingApartment: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.listBuildingApartment = action.payload;
    },
    setListBlockApartment: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.listBlockApartment = action.payload;
    },
  },
});

export const {
  setListContructionTypes,
  setListProvince,
  setListDistrict,
  setListWard,
  setListPosition,
  setListRoadContiguousTypes,
  setListProjectApartment,
  setListBuildingApartment,
  setListBlockApartment,
} = commonSlice.actions;

export default commonSlice.reducer;
export const getListContructionTypesAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getConstructionTypes();
      const listContructionTypes = res?.data || [];
      dispatch(setListContructionTypes(listContructionTypes));
    } catch (error) {}
  };
};

export const getListProvinceAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await addressApi.getProvinces();
      const listProvince = res?.data || [];
      dispatch(setListProvince(listProvince));
    } catch (error) {}
  };
};
export const getListDistrictAPI = (provinceCode: string) => {
  return async (dispatch: any) => {
    try {
      const res = await addressApi.getDistricts({ code: provinceCode });
      const listDistrict = res?.data || [];
      dispatch(setListDistrict(listDistrict));
    } catch (error) {}
  };
};
export const getListWardAPI = (districtCode: string) => {
  return async (dispatch: any) => {
    try {
      const res = await addressApi.getWards({ code: districtCode });
      const listWard = res?.data || [];
      dispatch(setListWard(listWard));
    } catch (error) {}
  };
};
export const getListPositionAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getPositions();
      if (res?.data?.length >= 0) {
        const listPosition = res?.data || [];
        dispatch(setListPosition(listPosition));
      } else {
        throw {};
      }
    } catch (error) {
      dispatch(setListPosition([]));
    }
  };
};
export const getListRoadContiguousTypesAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getRoadContiguousTypes();
      if (res?.data?.length >= 0) {
        const listRoadContiguousTypes = res?.data || [];
        dispatch(setListRoadContiguousTypes(listRoadContiguousTypes));
      } else {
        throw {};
      }
    } catch (error) {
      dispatch(setListRoadContiguousTypes([]));
    }
  };
};

export const getLisProjectApartmentAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getListProjectApartment();
      const listProjectApartment = res?.data?.data || [];
      dispatch(
        setListProjectApartment(
          listProjectApartment.map((el: any) => ({
            value: el.id,
            label: el.name,
          }))
        )
      );
    } catch (error) {}
  };
};

export const getLisBuildingApartmentAPI = (projectId: string) => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getListBuildingApartment({ projectId });
      const listBuildingApartment = res?.data?.data || [];
      dispatch(
        setListBuildingApartment(
          listBuildingApartment.map((el: any) => ({
            value: el.id,
            label: el.name,
          }))
        )
      );
    } catch (error) {}
  };
};

export const getLisBlockApartmentAPI = (
  projectId: string,
  buildingId: string
) => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getListBlockApartment({
        projectId,
        buildingId,
      });
      const listBlockApartment = res?.data?.data || [];
      dispatch(
        setListBlockApartment(
          listBlockApartment.map((el: any) => ({
            value: el.id,
            label: el.name,
          }))
        )
      );
    } catch (error) {}
  };
};
