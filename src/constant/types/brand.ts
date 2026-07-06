type VehicleBrandClassify = 1 | 2 | number; // 1: PTĐB; 2: PTĐT

type VehicleBrandType = {
  roadVehicleBrandId: number | null;
  roadVehicleBrandName: string;
  roadVehicleBranchType: VehicleBrandClassify;
  roadVehicleBranchParentId: number | null;
  roadVehicleBranchDescription: string;
};

type FilterVehicleBrandType = {
  type: VehicleBrandClassify;
  searchKey: string;
};

export type { VehicleBrandType, FilterVehicleBrandType, VehicleBrandClassify };
