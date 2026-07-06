import { SBAAxiosClient } from "./base";

export const commonAppraisalPurposeApi = {
  getAppraisalPurpose: () => {
    return SBAAxiosClient("/assets/api/v1/appraisalPurposes", {
      method: "GET",
    });
  },
  getAppartmentType: () => {
    return SBAAxiosClient("/assets/api/v1/apartmentTypes", {
      method: "GET",
    });
  },
  getOwnerType: () => {
    return SBAAxiosClient("/assets/api/v1/ownerTypes", {
      method: "GET",
    });
  },
  getAssetApartmentUsingPurposeTypes: () => {
    return SBAAxiosClient("/assets/api/v1/assetApartmentUsingPurposeTypes", {
      method: "GET",
    });
  },
};
