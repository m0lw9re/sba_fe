import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type DistanceToAssetType = {
  assetsId: string | null;
  distance: string | null;
};
interface appendixMethodsState {
  unitPrice: number | null;
  distanceToAssets: Array<DistanceToAssetType>;
}

const initialState: appendixMethodsState = {
  unitPrice: null,
  distanceToAssets: [],
};

export const appendixMethodsSlice = createSlice({
  name: "appendixMethods",
  initialState,
  reducers: {
    setUnitPrice: (state, action: PayloadAction<number | null>) => {
      state.unitPrice = action.payload;
    },

    setDistanceToAssets: (
      state,
      action: PayloadAction<Array<DistanceToAssetType>>
    ) => {
      return {
        ...state,
        distanceToAssets: [...action.payload],
      };
    },

    createInitDistanceToAssets: (
      state,
      action: PayloadAction<Array<DistanceToAssetType>>
    ) => {
      const assetsIds = new Set(state.distanceToAssets.map((d) => d.assetsId));
      const merged = [
        ...state.distanceToAssets,
        ...action.payload.filter((d) => !assetsIds.has(d.assetsId)),
      ];
      return {
        ...state,
        distanceToAssets: [...merged],
      };
    },
  },
});

export const { setUnitPrice, setDistanceToAssets, createInitDistanceToAssets } =
  appendixMethodsSlice.actions;

export default appendixMethodsSlice.reducer;
