type FilterLand = {
  customerName?: string | null,
  customerIndentity?: string | null,
  landPlotNumber?: string | null,
  mapSheetNumber?: string | null,
  addressProvince?: string | null,
  addressDistrict?: string | null,
  addressWard?: string | null,
  areaWidth?: string | null,
  usingPurposeId?: number | null,
  totalValue?: string | null,
}

type FilterVehicle = {
  customerId?: string;
  customerIdentity?: string;
};

export type { FilterLand, FilterVehicle };
