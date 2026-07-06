import { GetAssetMachineDeviceInforParam } from "constants/types/assetMachineDevice.type";
import { AssetMachineDevice } from "constants/types/assetMachineDevice.type";
import { SBAAxiosClient } from "./base";

export const assetMachineDeviceApi = {
  getAssetMachineDevice: (params: GetAssetMachineDeviceInforParam) => {
    return SBAAxiosClient("/assets/api/v1/assetMachine/" + params.assetId, {
      method: "GET",
    });
  },
  updateMachineDevice: (data: AssetMachineDevice) => {
    return SBAAxiosClient("/assets/api/v1/assetMachine", {
      method: "PUT",
      data,
    });
  },
  getAssetMachineDevicePurposeTypes: () => {
    return SBAAxiosClient("/assets/api/v1/assetMachineUsingPurposes", {
      method: "GET",
    });
  },
  getAssetMachineDeviceUsingOrigins: () => {
    return SBAAxiosClient("/assets/api/v1/assetMachineUsingOrigins", {
      method: "GET",
    });
  },
  getMachineBrands: () => {
    return SBAAxiosClient("/assets/api/v1/machineBrands", {
      method: "GET",
    });
  },
  
  getMachineModels: (branchId: number) => {
    return SBAAxiosClient("/assets/api/v1/machineModels/" + branchId, {
      method: "GET",
    });
  },
};
