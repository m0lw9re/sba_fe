import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {fastExpertiseApi} from "apis/fastExpertise";

interface State {
  address: any;
  listTSSS: any;
  assetInfo: any;
  valueExpertise: any;
  unPlanValueExpertise: any;
  addressText: any;
  type: "create" | "edit" | "view";
  detailDoc: any;
  listRoadInPrice: any[];
  listGearBox: any[];
  listWheelFormula: any[];
}

const initialState: State = {
  address: null,
  listTSSS: [],
  assetInfo: null,
  valueExpertise: null,
  unPlanValueExpertise: null,
  addressText: null,
  type: "create",
  detailDoc: null,
  listRoadInPrice: [],
  listGearBox: [],
  listWheelFormula: [],
};

export const fastExpertiseSlice = createSlice({
  name: "fastExpertise",
  initialState,
  reducers: {
    setAddress: (state = initialState, action: PayloadAction<any>) => {
      state.address = action.payload;
    },
    setAddressText: (state = initialState, action: PayloadAction<any>) => {
      state.addressText = action.payload;
    },
    setListTSSS: (state = initialState, action: PayloadAction<any>) => {
      state.listTSSS = action.payload;
    },
    setAssetInfo: (state = initialState, action: PayloadAction<any>) => {
      state.assetInfo = action.payload;
    },
    setValueExpertise: (state = initialState, action: PayloadAction<any>) => {
      state.valueExpertise = action.payload;
    },
    setUnPlanValueExpertise: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.unPlanValueExpertise = action.payload;
    },
    setType: (state = initialState, action: PayloadAction<any>) => {
      state.type = action.payload;
    },
    setDetailDoc: (state = initialState, action: PayloadAction<any>) => {
      state.detailDoc = action.payload;
    },
    setListRoadInPrice: (state = initialState, action: PayloadAction<any>) => {
      state.listRoadInPrice = action.payload;
    },
    setListGearBox: (state = initialState, action: PayloadAction<any>) => {
      state.listGearBox = action.payload;
    },
    setListWheelFormula: (state = initialState, action: PayloadAction<any>) => {
      state.listWheelFormula = action.payload;
    },
  },
});

export const {
  setAddress,
  setListTSSS,
  setAssetInfo,
  setValueExpertise,
  setUnPlanValueExpertise,
  setAddressText,
  setType,
  setDetailDoc,
  setListRoadInPrice,
  setListGearBox,
  setListWheelFormula,
} = fastExpertiseSlice.actions;

export default fastExpertiseSlice.reducer;
export const getListRoadInPriceAPI = (provinceCode: string) => {
  return async (dispatch: any) => {
    try {
      const res = await fastExpertiseApi.getListRoadInPrice(provinceCode);
      const listRoadInPrice = res?.data.code === 400 ? [] : res?.data || []
      dispatch(setListRoadInPrice(listRoadInPrice));
    } catch (error) {}
  };
};
export const getListGearBoxAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await fastExpertiseApi.getListGearBox();
      if (res?.data?.length >= 0) {
        const listGearBox = res?.data || [];
        dispatch(setListGearBox(listGearBox));
      } else {
        throw {};
      }
    } catch (error) {}
  };
};
export const getListWheelFormulaAPI = () => {
  return async (dispatch: any) => {
    try {
      const res = await fastExpertiseApi.getListWheelFormula();
      if (res?.data?.length >= 0) {
        const listWheelFormula = res?.data || [];
        dispatch(setListWheelFormula(listWheelFormula));
      } else {
        throw {};
      }
    } catch (error) {}
  };
};
