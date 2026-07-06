import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { getAllMenu, getAllMenuLv3, getAllMenuLv3Success, getAllMenuSuccess, getAssetLv1, getAssetLv1Success, getAssetLv3, getAssetLv3Success } from "./PriceMenuSlice";
import { assetPricesApi } from "apis/prices";

function* getMenuPriceSaga(
    action: PayloadAction<number>
): unknown {
    try {
        const response = yield call(assetPricesApi.menuPriceLv2, action.payload);
        const payload: any = response.data; 
        yield put({ type: getAllMenuSuccess.type, payload });
    } catch (error) {
        
    }
}

function* getMenuLv3PriceSaga(
    action: PayloadAction<number>
): unknown {
    try {
        const response = yield call(assetPricesApi.menuPriceLv3);
        const payload: any = response.data;
        yield put({ type: getAllMenuLv3Success.type, payload });
    } catch (error) {
        
    }
}

function* getAssetLv1Saga(
    action: PayloadAction<number>
): unknown {
    try {
        const response = yield call(assetPricesApi.getAssetL1, action.payload);
        const payload: any = response.data;
        yield put({ type: getAssetLv1Success.type, payload });
    } catch (error) {
        
    }
}

function* getAssetLv3Saga(
    action: PayloadAction<number>
): unknown {
    try {
        const response = yield call(assetPricesApi.getAssetL3, action.payload);
        const payload: any = response.data;
        yield put({ type: getAssetLv3Success.type, payload });
    } catch (error) {
        
    }
}

function* mySaga() {
    yield takeLatest(getAllMenu.type, getMenuPriceSaga);
    yield takeLatest(getAllMenuLv3.type, getMenuLv3PriceSaga);
    yield takeLatest(getAssetLv1.type, getAssetLv1Saga);
    yield takeLatest(getAssetLv3.type, getAssetLv3Saga);
}

export default mySaga;
