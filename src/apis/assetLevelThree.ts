import { SBAAxiosClient } from "./base";
import { CommonGetAllParams } from "../constants/types/common.type";
import { AssetLevelThreeType } from "constant/types";

export type AssetLevelThreeCreateType = Omit<
  AssetLevelThreeType,
  "assetLevelThreeId"
> & {
  assetLevelThreeId: number | null;
};

export const assetLevelThreeApi = {
  getAssetRoadVehicleInfo: (assetLevelTwoId: number) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLevelThree/get_by_asset_level_two/" +
        assetLevelTwoId,
      {
        method: "GET",
      }
    );
  },
  createUpdateAssetLevelThree: (data: AssetLevelThreeCreateType) => {
    return SBAAxiosClient("/assets/api/v1/assetLevelThree/", {
      method: "POST",
      data,
    });
  },
};
