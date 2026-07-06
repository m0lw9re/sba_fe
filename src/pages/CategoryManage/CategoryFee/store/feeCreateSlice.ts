import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface feeCreate {
  assetLevelThreeId: number | null;
  assetLevelTwoId: number | null;
}

const initialState: feeCreate = {
  assetLevelTwoId: null,
  assetLevelThreeId: null,
};

export const feeDetailSlice = createSlice({
  name: "feeCreate",
  initialState,
  reducers: {
    setAssetLevelTwoId: (state, action: PayloadAction<number | null>) => {
      state.assetLevelTwoId = action.payload;
    },
    setAssetLevelThreeId: (state, action: PayloadAction<number | null>) => {
      state.assetLevelThreeId = action.payload;
    },
  },
});

export const { setAssetLevelThreeId, setAssetLevelTwoId } = feeDetailSlice.actions;

export default feeDetailSlice.reducer;
