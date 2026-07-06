import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppraisalFileCreateState {
  assetLevelOneId: number | null;
  assetLevelTwoId: number | null;
  customerTypeId: number | null;
}

const initialState: AppraisalFileCreateState = {
  assetLevelOneId: null,
  assetLevelTwoId: null,
  customerTypeId: null,
};

export const appraisalFileDetailSlice = createSlice({
  name: "appraisalFileCreate",
  initialState,
  reducers: {
    setAssetLevelOneId: (state, action: PayloadAction<number | null>) => {
      state.assetLevelOneId = action.payload;
    },
    setAssetLevelTwoId: (state, action: PayloadAction<number | null>) => {
      state.assetLevelTwoId = action.payload;
    },
    setCustomerTypeId: (state, action: PayloadAction<number | null>) => {
      state.customerTypeId = action.payload;
    },
  },
});

export const { setAssetLevelOneId, setAssetLevelTwoId, setCustomerTypeId } =
  appraisalFileDetailSlice.actions;

export default appraisalFileDetailSlice.reducer;
