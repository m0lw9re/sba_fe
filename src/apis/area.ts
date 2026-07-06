import { AreaSettingByIdType } from "constant/types";
import { SBAAxiosClient } from "./base";

export const areaSettingApi = {
  getAreaProvince: (provinceCode: string, areaState: number) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/commitmentDate/area/${areaState}?provinceCode=${provinceCode}`,
      {
        method: "GET",
      }
    );
  },
  updateAreaProvince: (data: AreaSettingByIdType) => {
    return SBAAxiosClient(`/bussiness/api/v1/commitmentDate/area`, {
      method: "PUT",
      data,
    });
  },
};
