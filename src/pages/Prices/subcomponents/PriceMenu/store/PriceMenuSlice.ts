import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DataPrice {
    total?: number,
    data?: Array<any>,
    limit?: number,
    page?: number,
}

interface InitState {
    menuLv2: Array<any>,
    menuLv3: Array<any>,
    assetLv1: DataPrice
}


const initialState: InitState = {
    menuLv2: [],
    menuLv3: [],
    assetLv1: {},
};

export const getMenuPrice = createSlice({
    name: "AppraisalFiles",
    initialState,
    reducers: {
        getAllMenu: (
            state,
            action: PayloadAction<number>
        ) => {
        },
        getAllMenuLv3: (
            state,
        ) => {
        },
        getAllMenuSuccess: (state, action: PayloadAction<any>) => {      
            state.menuLv2 = action.payload;
        },
        getAllMenuLv3Success: (state, action: PayloadAction<any>) => {
            state.menuLv3 = action.payload;
        },
        getAssetLv1: (state, action: PayloadAction<number>) => {
        },
        getAssetLv1Success: (state, action: PayloadAction<any>) => {
            state.assetLv1 = action.payload;
        },
        getAssetLv3: (state, action: PayloadAction<number>) => {
        },
        getAssetLv3Success: (state, action: PayloadAction<any>) => {
            state.assetLv1 = action.payload;
        },
    },
});

export const {
    getAllMenu,
    getAllMenuLv3,
    getAllMenuSuccess,
    getAllMenuLv3Success,
    getAssetLv1,
    getAssetLv1Success,
    getAssetLv3,
    getAssetLv3Success,
} = getMenuPrice.actions;

export default getMenuPrice.reducer;
