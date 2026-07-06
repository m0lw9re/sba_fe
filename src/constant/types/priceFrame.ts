type FilterPriceFrameType = {
  provinceCode?: string | null;
  road?: string | null;
  isFiltering?: boolean;
};

type PriceFrameType = {
  roadInPriceRangeId?: number;
  provinceCode?: string | null;
  province?: string | null;
  districts?: string | null;
  districtsCode?: string | null;
  wards?: string | null;
  road?: string | null;
  doanDuongTu?: string | null;
  doanDuongDen?: string | null;
  giaNhaNuoc?: number | null;
  giaThiTruongTu?: number | null;
  giaThiTruongDen?: number | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
};

export type { FilterPriceFrameType, PriceFrameType };
