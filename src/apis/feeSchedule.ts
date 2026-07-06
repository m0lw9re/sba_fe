import { SBAAxiosClient } from "./base";

export const feeScheduleApi = {
  //Lấy tài sản cấp 2
  getAssetLevelTwo: () => {
    return SBAAxiosClient("/assets/api/v1/assetLevelTwo/get_all", {
      method: "GET",
    });
  },

  //Lấy biểu phí
  getFeeSchedule: () => {
    return SBAAxiosClient("/bussiness/api/v1/find/shedule-id-new", {
      method: "GET",
    });
  },

  //Thêm biểu phí
  createFeeSchedule: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/fee-schedule/create", {
      method: "POST",
      data,
    });
  },

  //Sửa biểu phí
  updateFeeSchedule: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/fee-schedule/update", {
      method: "PUT",
      data,
    });
  },

  //Sửa biểu phí
  deleteFeeSchedule: (id: any) => {
    return SBAAxiosClient("/bussiness/api/v1/fee-schedule/delete/" + id, {
      method: "DELETE",
    });
  },
};
