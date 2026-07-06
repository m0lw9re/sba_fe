import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetAllAssetRealEstateStorageSuccessPayload } from "./store.type";
import { GetAllAssetRealEstateStorage } from "constants/types/assetCommon.type";

type PricesAssetRealEstateStorageState = {
    isLoading: boolean;
    pricesAssetRealEstate: Array<GetAllAssetRealEstateStorage>
}

const initialState: PricesAssetRealEstateStorageState = {
    isLoading: false,
    pricesAssetRealEstate: []
}

export const PricesSlice = createSlice({
    name: "Prices",
    initialState,
    reducers: {
        getAllAssetRealEstateStorage: (state) => {
            state.isLoading = true
        },
        getAllAssetRealEstateStorageSuccess: (
            state,
            action: PayloadAction<GetAllAssetRealEstateStorageSuccessPayload> 
        ) => {
            state.isLoading = false;
            state.pricesAssetRealEstate = action.payload.pricesAssetRealEstate
        }
    }
})

export const {
    getAllAssetRealEstateStorage,
    getAllAssetRealEstateStorageSuccess
} = PricesSlice.actions;

export default PricesSlice.reducer;