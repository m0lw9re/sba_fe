import { CommonGetAllParams } from "constants/types/common.type";
import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";

export const exportStoredAsset = {
  exportData: (params?: CommonGetAllParams) => {
    let url = "/assets/api/v2/storedAsset/download/";

    const filteredParam = Object.fromEntries(
      Object.entries(params || {}).filter(([key, value]) => value !== null && value !== undefined)
    );

    let isFirstParam = true;
    for (const key in filteredParam) {
      if (Object.prototype.hasOwnProperty.call(filteredParam, key)) {
        if (isFirstParam) {
          url += `?${key}=${filteredParam[key]}`;
          isFirstParam = false;
        } else {
          url += `&${key}=${filteredParam[key]}`;
        }
      }
    }

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
      timeout: 5*60*1000,
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
};
