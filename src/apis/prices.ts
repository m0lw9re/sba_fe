import { SBAAxiosClient } from "./base";

export const assetPricesApi = {
    createAssetRealEstateStorage: (data?: FormData) => {
        return SBAAxiosClient("/assets/api/v1/assetLandRealEstateStorage", {
            method: "POST",
            data
        });
    },
    // getAllAssetRealEstateStorage: () => {
    //     return SBAAssets("/api/v1/assetLandRealEstateStorages/get_all",{
    //         method: "GET"
    //     })
    // },
    menuPrice: (assetCode: number) => {
        return SBAAxiosClient(`/assets/api/v1/assetLevelTwo/get_all`)
    },
    menuPriceLv2: (assetCode: number) => {
        return SBAAxiosClient(`/assets/api/v1/assetLevelTwo/get_by_asset_level_one/${assetCode}`)
    },
    
    menuPriceLv3: () => {
        return SBAAxiosClient(`/assets/api/v1/assetLevelThree/get_all`)
    },
    getAssetL1: (assetCode: number) => {
        return SBAAxiosClient(`/assets/api/v1/assetLandRealEstateStorages/get_paging_by_asset_one?page=1&limit=10&leveId=${assetCode}`)
    }, 
    getAssetL3: (assetCode: number) => {
        return SBAAxiosClient(`/assets/api/v1/assetLandRealEstateStorages/get_paging_by_asset_three?page=1&limit=10&leveId=${assetCode}`)
    }, 
};


