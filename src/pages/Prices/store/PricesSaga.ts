// import { assetPricesApi } from "apis/prices";
// import { call, put, takeLatest } from "redux-saga/effects";
// import { GetAllAssetRealEstateStorageSuccessPayload } from "./store.type";
// import { getAllAssetRealEstateStorageSuccess, getAllAssetRealEstateStorage } from "./PricesSlice";
// import { message } from "antd";

// function * getPricesAssetRealEstateStorageSaga () : unknown {
//     // console.log("vao get data storage");
//     // try {
//     //     // const response = yield call(assetPricesApi.getAllAssetRealEstateStorage);
//     //     const payload: GetAllAssetRealEstateStorageSuccessPayload = {
//     //         pricesAssetRealEstate: response.data
//     //     }
//     //     console.log(response);
        
//     //     yield put({type: getAllAssetRealEstateStorageSuccess.type, payload})
//     // } catch (error) {
//     //     message.error("Lỗi khi lấy danh sách tài sản nhà đất kho giá");
//     // }
// }   

function* pricesSaga(){    
    // yield takeLatest(getAllAssetRealEstateStorage.type, getPricesAssetRealEstateStorageSaga);
}

export default pricesSaga;