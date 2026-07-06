type CreateRealEstateLegalType = {
  legalDocumentTypeId?: string | null,
  name?: string | null,
  customerTypeId?: number | null,
  assetLevelTwoId?: number | null,
  isRequired?: number | null,
  isDeleted?: number | null,
};

type CreateWaterwayVehiclesLegalType = {
  legalWaterwayVehiclesName?: string | null;
  legalWaterwayVehiclesRequest?: string | null;
};

type CreateRoadVehiclesLegalType = {
  legalRoadVehiclesName?: string | null;
  legalRoadVehiclesRequest?: string | null;
};

type CreateDevicesLegalType = {
  legalDevicesName?: string | null;
  legalDevicesRequest?: string | null;
};

type EditRealEstateLegalType = {
  legalRealEstateName?: string | null;
  legalRealEstateRequest?: string | null;
};

type EditWaterwayVehiclesLegalType = {
  legalWaterwayVehiclesName?: string | null;
  legalWaterwayVehiclesRequest?: string | null;
};

type EditRoadVehiclesLegalType = {
  legalRoadVehiclesName?: string | null;
  legalRoadVehiclesRequest?: string | null;
};

type EditDevicesLegalType = {
  legalDevicesName?: string | null;
  legalDevicesRequest?: string | null;
};

type FilterRealEstateLegalType = {
  keyword?: string;
};

type FilterWaterwayVehiclesLegalType = {
  keyword?: string;
};

type FilterRoadVehiclesLegalType = {
  keyword?: string;
};

type FilterDevicesLegalType = {
  keyword?: string;
};
type TreeType = {
  assetTreeTypeId: number;
  assetTreeTypeName: string;
  description: string;
};

export type {
  CreateRealEstateLegalType,
  EditRealEstateLegalType,
  FilterRealEstateLegalType,
  CreateWaterwayVehiclesLegalType,
  EditWaterwayVehiclesLegalType,
  FilterWaterwayVehiclesLegalType,
  CreateRoadVehiclesLegalType,
  EditRoadVehiclesLegalType,
  FilterRoadVehiclesLegalType,
  CreateDevicesLegalType,
  EditDevicesLegalType,
  FilterDevicesLegalType,
  TreeType,
};
