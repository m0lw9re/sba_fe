import {SBAAxiosClient} from "./base";

export const fastExpertiseApi = {
  // Dũng tạo
  getListTSSS: (params: any) => {
    return SBAAxiosClient("/assets/api/v1/fastValuation", {
      method: "GET",
      params: params,
    });
  },
  getListRoadInPrice: (provinceCode: any) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/roadInPrice/get_by_provinceCode/${provinceCode}`,
      {
        method: "GET",
      }
    );
  },
  getListDocument: (params: any) => {
    return SBAAxiosClient("/assets/api/v1/fastValuation", {
      method: "GET",
      params: params,
    });
  },
  createDoc: (data: any, assetType: any) => {
    return SBAAxiosClient(
      `/assets/api/v1/fastValuation/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },
  getDoc: (id: any, assetType: any) => {
    return SBAAxiosClient(
      `/assets/api/v1/fastValuation/${id}?assetType=${assetType}`,
      {
        method: "GET",
      }
    );
  },
  updateDoc: (data: any, assetType: any) => {
    return SBAAxiosClient(
      `/assets/api/v1/fastValuation?assetType=${assetType}`,
      {
        method: "PUT",
        data,
      }
    );
  },
  deleteDoc: (id: any, assetType: any) => {
    return SBAAxiosClient(
      `/assets/api/v1/fastValuation/${id}?assetType=${assetType}`,
      {
        method: "DELETE",
      }
    );
  },
  getListConstructNameByConstructTypeId: (id: any) => {
    return SBAAxiosClient(`/assets/api/v1/constructionNames/${id}`, {
      method: "GET",
    });
  },
  getListGearBox: () => {
    return SBAAxiosClient(`/assets/api/v1/gearBoxs`, {
      method: "GET",
    });
  },
  getListWheelFormula: () => {
    return SBAAxiosClient(`/assets/api/v1/wheelFormulas`, {
      method: "GET",
    });
  },
};
