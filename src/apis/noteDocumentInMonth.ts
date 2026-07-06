import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";

export const noteDocumentInMonth = {
  exportExcell: (
    param?: any,
    type?: "search" | "cancel"
  ) => {
    let url = `${
      type === "search"
        ? "/bussiness/api/v1/recordArise/exportExcel"
        : "/bussiness/api/v1/recordArise/cancel/exportExcel"
    }`;

    // Lọc ra các key có giá trị khác null hoặc undefined
    const filteredParam = Object.fromEntries(
      Object.entries(param || {}).filter(([key, value]) => value !== null && value !== undefined)
    );

    // Thêm các key từ param vào URL
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
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
};

