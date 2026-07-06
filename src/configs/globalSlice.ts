import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addressApi } from "apis/adress";
import { approvalConfigsApi } from "apis/approvalConfigs";
import { assetCommonApi } from "apis/assetCommon";
import { brandApi } from "apis/brand";
import { categoryApi } from "apis/category";
import { contructionApi } from "apis/contruction";
import { customerApi } from "apis/customer";
import { systemApi } from "apis/system";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  AppraisalPurposeType,
  AppraisalTypeType,
  AssetLevelOneType,
  ConstructionType,
  LegalStatusType,
  ProvinceType,
  VehicleBrandType,
} from "constant/types";
import { JobTypeType, PriorityLevelType } from "constant/types/assignment";
import {
  BusinessAdvantageType,
  DataSourceType,
  LiquitiesType,
  SacomUnitType,
  UsingPurposeType,
  manufacturingCountryType,
} from "constant/types/categories";
import { TreeType } from "constant/types/categorylegal";
import {
  CategoryCommonType,
  InfoSourceType,
  OptionType,
  PositionInPriceRange,
  PositionType,
  RoadInPriceType,
} from "constant/types/common";
import { ConstructionLegalTypeType } from "constant/types/contruction";
import { UtilityType } from "constant/types/system";
import { Zone } from "constants/types/assetCommon.type";
import {
  Branch,
  CompanyBranch,
  TransactionOffice,
} from "constants/types/branch";
import { CustomerType } from "constants/types/customer.type";
import { ButtonPermissionType } from "constants/types/menu.type";
import { Region } from "constants/types/region";
import { transformToOptions } from "utils/common";

interface DataFilter {
  params: {
    limit: number;
    page: number;
  };
  filters: Record<string, any>;
  typeName: string;
}

interface GlobalState {
  constructionTypeData: ConstructionType[];
  constructionTypeOptions: OptionType[];

  assetLevelOneData: AssetLevelOneType[];
  assetLevelOneOptions: OptionType[];

  provinceData: ProvinceType[];
  provinceOptions: OptionType[];

  listPositionData: PositionType[];
  listPositionOptions: OptionType[];

  usingPurposeData: UsingPurposeType[];
  usingPurposeOptions: OptionType[];

  branchData: Branch[];
  branchOptions: OptionType[];

  regionData: Region[];
  regionOptions: OptionType[];

  transOfficeData: TransactionOffice[];
  transOfficeOptions: OptionType[];

  companyBranchData: CompanyBranch[];
  companyBranchOptions: OptionType[];

  sacombankUnitData: SacomUnitType[];
  sacombankUnitOptions: OptionType[];

  appraisalPurposeData: AppraisalPurposeType[];
  appraisalPurposeOptions: OptionType[];

  infoSourceData: InfoSourceType[];
  infoSourceOptions: OptionType[];

  categoryCommonData: CategoryCommonType[];
  categoryCommonsOptions: OptionType[];

  zoneData: Zone[];
  zoneOptions: OptionType[];

  positionInPriceRangeData: PositionInPriceRange[];
  positionInPriceRangeOptions: OptionType[];

  roadContiguousTypeData: RoadInPriceType[];
  roadContiguousTypeOptions: OptionType[];

  appraisalTypeData: AppraisalTypeType[];
  appraisalTypeOptions: OptionType[];

  legalStatusRealEstateData: LegalStatusType[];
  legalStatusRealEstateOptions: OptionType[];

  legalStatusMovableEstateData: LegalStatusType[];
  legalStatusMovableEstateOptions: OptionType[];

  customerTypeData: CustomerType[];
  customerTypeOptions: OptionType[];

  jobTypeData: JobTypeType[];
  jobTypeOptions: OptionType[];

  priorityLevelData: PriorityLevelType[];
  priorityLevelOptions: OptionType[];

  constructionLegalTypeData: ConstructionLegalTypeType[];
  constructionLegalTypeOptions: OptionType[];

  treeTypeData: TreeType[];
  treeTypeOptions: OptionType[];

  businessAdvantageData: BusinessAdvantageType[];
  businessAdvantageOptions: OptionType[];

  liquitiesData: LiquitiesType[];
  liquitiesOptions: OptionType[];

  dataSourceData: DataSourceType[];
  dataSourceOptions: OptionType[];

  manufacturingCountryData: manufacturingCountryType[];
  manufacturingCountryOptions: OptionType[];

  roadVehicleBrandData: VehicleBrandType[];
  roadVehicleBrandOptions: OptionType[];

  waterVehicleBrandData: VehicleBrandType[];
  waterVehicleBrandOptions: OptionType[];

  riskTypeData: any[];
  riskTypeOptions: any[];

  utilitiesData: UtilityType[];
  utilitiesOptions: OptionType[];

  listRoleData: any[];
  listRoleOptions: OptionType[];

  dataFilter: DataFilter;

  isLoading: boolean;
  networkError: boolean;
  imagesAndLocationLoaded: boolean;
  appraisalFileCreateChange: any;
  currentPagePermissions: ButtonPermissionType[] | null;
  currentPage: string | null;
}

const initialState: GlobalState = {
  constructionTypeData: [],
  constructionTypeOptions: [],

  assetLevelOneData: [],
  assetLevelOneOptions: [],

  provinceData: [],
  provinceOptions: [],

  listPositionData: [],
  listPositionOptions: [],

  usingPurposeData: [],
  usingPurposeOptions: [],

  branchData: [],
  branchOptions: [],

  companyBranchData: [],
  companyBranchOptions: [],

  regionData: [],
  regionOptions: [],

  transOfficeData: [],
  transOfficeOptions: [],

  sacombankUnitData: [],
  sacombankUnitOptions: [],

  appraisalPurposeData: [],
  appraisalPurposeOptions: [],

  infoSourceData: [],
  infoSourceOptions: [],

  categoryCommonData: [],
  categoryCommonsOptions: [],

  zoneData: [],
  zoneOptions: [],

  positionInPriceRangeData: [],
  positionInPriceRangeOptions: [],

  roadContiguousTypeData: [],
  roadContiguousTypeOptions: [],

  appraisalTypeData: [],
  appraisalTypeOptions: [],

  legalStatusRealEstateData: [],
  legalStatusRealEstateOptions: [],

  legalStatusMovableEstateData: [],
  legalStatusMovableEstateOptions: [],

  customerTypeData: [],
  customerTypeOptions: [],

  jobTypeData: [],
  jobTypeOptions: [],

  priorityLevelData: [],
  priorityLevelOptions: [],

  constructionLegalTypeData: [],
  constructionLegalTypeOptions: [],

  treeTypeData: [],
  treeTypeOptions: [],

  businessAdvantageData: [],
  businessAdvantageOptions: [],

  liquitiesData: [],
  liquitiesOptions: [],

  dataSourceData: [],
  dataSourceOptions: [],

  manufacturingCountryData: [],
  manufacturingCountryOptions: [],

  roadVehicleBrandData: [],
  roadVehicleBrandOptions: [],

  waterVehicleBrandData: [],
  waterVehicleBrandOptions: [],

  riskTypeData: [],
  riskTypeOptions: [],

  utilitiesData: [],
  utilitiesOptions: [],

  listRoleData: [],
  listRoleOptions: [],

  dataFilter: {
    params: {
      limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
        ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
        : PAGE_SIZE_OPTIONS.OPTION_10,
      page: 1,
    },
    filters: {},
    typeName: "",
  },

  isLoading: true,
  networkError: false,
  currentPagePermissions: null,
  currentPage: null,
  imagesAndLocationLoaded: false,
  appraisalFileCreateChange: [],
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // UI state
    setLoading: (state = initialState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRedirectPage: (state = initialState, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setCurrentPagePermissions: (
      state = initialState,
      action: PayloadAction<ButtonPermissionType[]>
    ) => {
      state.currentPagePermissions = action.payload;
    },
    setNetworkError: (state = initialState, action: PayloadAction<boolean>) => {
      state.networkError = action.payload;
    },
    setImagesAndLocationLoaded: (
      state = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.imagesAndLocationLoaded = action.payload;
    },
    // handle store data to redux
    setAssetLevelOne: (state = initialState, action: PayloadAction<any>) => {
      state.assetLevelOneOptions = transformToOptions(
        action.payload,
        "assetLevelOneName",
        "assetLevelOneId"
      );
      state.assetLevelOneData = action.payload;
    },
    setChangeAppraisalFileCreate: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      const { title, value } = action.payload;
      if (title) {
        const foundIndex = state.appraisalFileCreateChange.findIndex(
          (item: any) => item.title === title
        );
        if (foundIndex !== -1) {
          state.appraisalFileCreateChange[foundIndex].value = value;
        } else {
          state.appraisalFileCreateChange.push({ title, value });
        }
      }
    },
    setConstructionTypes: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.constructionTypeOptions = transformToOptions(
        action.payload,
        "constructionTypeName",
        "constructionTypeId"
      );
      state.constructionTypeData = action.payload;
    },
    setListProvince: (state = initialState, action: PayloadAction<any>) => {
      state.provinceOptions = transformToOptions(
        action.payload,
        "fullName",
        "code"
      );
      state.provinceData = action.payload;
    },
    setListPosition: (state = initialState, action: PayloadAction<any>) => {
      state.listPositionOptions = transformToOptions(
        action.payload,
        "positionName",
        "positionId"
      );
      state.listPositionData = action.payload;
    },
    setUsingPurpose: (state = initialState, action: PayloadAction<any>) => {
      state.usingPurposeOptions = transformToOptions(
        action.payload,
        "usingPurposeName",
        "usingPurposeId"
      );
      state.usingPurposeData = action.payload;
    },
    setBranch: (state = initialState, action: PayloadAction<any>) => {
      state.branchOptions = transformToOptions(
        action.payload,
        "companyBranchName",
        "companyBranchId"
      );
      state.branchData = action.payload;
    },
    setCompanyBranch: (state = initialState, action: PayloadAction<any>) => {
      state.companyBranchOptions = transformToOptions(
        action.payload,
        "branchName",
        "branchCode"
      );
      state.companyBranchData = action.payload;
    },
    setRegion: (state = initialState, action: PayloadAction<any>) => {
      state.regionOptions = transformToOptions(
        action.payload,
        "regionName",
        "regionCode"
      );
      state.regionData = action.payload;
    },
    setTransoffice: (state = initialState, action: PayloadAction<any>) => {
      state.transOfficeOptions = transformToOptions(
        action.payload,
        "transOfficeName",
        "transOfficeCode"
      );
      state.transOfficeData = action.payload;
    },
    setSacomUnit: (state = initialState, action: PayloadAction<any>) => {
      state.sacombankUnitOptions = transformToOptions(
        action.payload,
        "unit",
        "code"
      );
      state.sacombankUnitData = action.payload;
    },
    setAppraisalPurpose: (state = initialState, action: PayloadAction<any>) => {
      state.appraisalPurposeOptions = transformToOptions(
        action.payload,
        "appraisalPurposeName",
        "appraisalPurposeId"
      );
      state.appraisalPurposeData = action.payload;
    },
    setInfoSource: (state = initialState, action: PayloadAction<any>) => {
      state.infoSourceOptions = transformToOptions(
        action.payload,
        "infoSourceName",
        "infoSourceId"
      );
      state.infoSourceData = action.payload;
    },
    setCategoryCommon: (state = initialState, action: PayloadAction<any>) => {
      state.categoryCommonsOptions = transformToOptions(
        action.payload,
        "name",
        "id"
      );
      state.categoryCommonData = action.payload;
    },
    setZone: (state = initialState, action: PayloadAction<any>) => {
      state.zoneOptions = transformToOptions(action.payload, "zone", "zoneId");
      state.zoneData = action.payload;
    },
    setPositionInRange: (state = initialState, action: PayloadAction<any>) => {
      state.positionInPriceRangeOptions = transformToOptions(
        action.payload,
        "positionInPriceRangeName",
        "positionInPriceRangeId"
      );
      state.positionInPriceRangeData = action.payload;
    },
    setContiguousType: (state = initialState, action: PayloadAction<any>) => {
      state.roadContiguousTypeOptions = transformToOptions(
        action.payload,
        "roadContiguousTypeName",
        "roadContiguousTypeId"
      );
      state.roadContiguousTypeData = action.payload;
    },
    setAppraisalType: (state = initialState, action: PayloadAction<any>) => {
      state.appraisalTypeOptions = transformToOptions(
        action.payload,
        "appraisalTypeName",
        "appraisalTypeId"
      );
      state.appraisalTypeData = action.payload;
    },
    setLegalStatusRealEstate: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.legalStatusRealEstateOptions = transformToOptions(
        action.payload,
        "legalStatusName",
        "legalStatusId"
      );
      state.legalStatusRealEstateData = action.payload;
    },
    setLegalStatusMovableEstate: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.legalStatusMovableEstateOptions = transformToOptions(
        action.payload,
        "legalStatusName",
        "legalStatusId"
      );
      state.legalStatusMovableEstateData = action.payload;
    },
    setCustomerType: (state = initialState, action: PayloadAction<any>) => {
      state.customerTypeOptions = transformToOptions(
        action.payload,
        "customerTypeName",
        "customerTypeId"
      );
      state.customerTypeData = action.payload;
    },
    setJobType: (state = initialState, action: PayloadAction<any>) => {
      state.jobTypeOptions = transformToOptions(
        action.payload,
        "jobTypeName",
        "jobTypeId"
      );
      state.jobTypeData = action.payload;
    },
    setPriorityLevel: (state = initialState, action: PayloadAction<any>) => {
      state.priorityLevelOptions = transformToOptions(
        action.payload,
        "name",
        "id"
      );
      state.priorityLevelData = action.payload;
    },
    setConstructionLegalType: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.constructionLegalTypeOptions = transformToOptions(
        action.payload,
        "name",
        "id"
      );
      state.constructionLegalTypeData = action.payload;
    },
    setTreeType: (state = initialState, action: PayloadAction<any>) => {
      state.treeTypeOptions = transformToOptions(
        action.payload,
        "assetTreeTypeName",
        "assetTreeTypeId"
      );
      state.treeTypeData = action.payload;
    },
    setBusinessAdvantage: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.businessAdvantageOptions = transformToOptions(
        action.payload,
        "name",
        "name" // dung roi k sao dau nha
      );
      state.businessAdvantageData = action.payload;
    },
    setLiquidities: (state = initialState, action: PayloadAction<any>) => {
      state.liquitiesOptions = transformToOptions(
        action.payload,
        "name",
        "id" // dung roi k sao dau nha
      );
      state.liquitiesData = action.payload;
    },
    setDataSource: (state = initialState, action: PayloadAction<any>) => {
      state.dataSourceOptions = transformToOptions(
        action.payload,
        "dataSourceName",
        "dataSourceId"
      );
      state.dataSourceData = action.payload;
    },
    setManufacturingCountry: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.manufacturingCountryOptions = transformToOptions(
        action.payload,
        "name",
        "id"
      );
      state.manufacturingCountryData = action.payload;
    },
    setRoadVehicleBrand: (state = initialState, action: PayloadAction<any>) => {
      state.roadVehicleBrandOptions = transformToOptions(
        action.payload.map((item: any) => ({
          ...item,
          roadVehicleBrandId: item.roadVehicleBrandId.toString(),
        })),
        "roadVehicleBrandName",
        "roadVehicleBrandId"
      );
      state.roadVehicleBrandData = action.payload;
    },
    setWaterVehicleBrand: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
      state.waterVehicleBrandOptions = transformToOptions(
        action.payload.map((item: any) => ({
          ...item,
          roadVehicleBrandId: item.roadVehicleBrandId.toString(),
        })),
        "roadVehicleBrandName",
        "roadVehicleBrandId"
      );
      state.waterVehicleBrandData = action.payload;
    },
    setRiskType: (state = initialState, action: PayloadAction<any>) => {
      state.riskTypeOptions = transformToOptions(
        action.payload,
        "riskTypeName",
        "riskTypeId"
      );
      state.riskTypeData = action.payload;
    },
    setUtility: (state = initialState, action: PayloadAction<any>) => {
      state.utilitiesOptions = transformToOptions(action.payload, "name", "id");
      state.utilitiesData = action.payload;
    },
    setListRole: (state = initialState, action: PayloadAction<any>) => {
      state.listRoleOptions = action.payload.map((item: string) => ({
        value: item,
        label: item,
      }));
      state.listRoleData = action.payload;
    },

    setDataFilter: (state = initialState, action: PayloadAction<any>) => {
      state.dataFilter = action.payload;
    },
  },
});
export default globalSlice.reducer;

export const {
  setImagesAndLocationLoaded,
  setDataFilter,
  setRedirectPage,
  setCurrentPagePermissions,
  setConstructionTypes,
  setListProvince,
  setListPosition,
  setUsingPurpose,
  setLoading,
  setNetworkError,
  setAssetLevelOne,
  setChangeAppraisalFileCreate,
  setBranch,
  setCompanyBranch,
  setRegion,
  setTransoffice,
  setSacomUnit,
  setAppraisalPurpose,
  setInfoSource,
  setCategoryCommon,
  setZone,
  setPositionInRange,
  setContiguousType,
  setAppraisalType,
  setLegalStatusRealEstate,
  setLegalStatusMovableEstate,
  setCustomerType,
  setJobType,
  setPriorityLevel,
  setConstructionLegalType,
  setTreeType,
  setBusinessAdvantage,
  setLiquidities,
  setDataSource,
  setManufacturingCountry,
  setRoadVehicleBrand,
  setWaterVehicleBrand,
  setRiskType,
  setUtility,
  setListRole,
} = globalSlice.actions;

export const getConstructionTypes = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getConstructionTypes();
      const listConstructionTypes = res?.data || [];
      dispatch(setConstructionTypes(listConstructionTypes));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListProvince = () => {
  return async (dispatch: any) => {
    try {
      const res = await addressApi.getProvinces();
      const listProvince = res?.data || [];
      dispatch(setListProvince(listProvince));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};

export const getListPosition = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getPositions();
      if (res?.data?.length >= 0) {
        const listPositionData = res?.data || [];
        dispatch(setListPosition(listPositionData));
      } else {
      }
    } catch (error) {
      dispatch(setListPosition([]));
    }
  };
};
export const getListUsingPurpose = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getUsingPurpose();
      const usingPurposesOptions =
        res.data?.items?.map((el: any) => {
          const checkKCN = el.insideOutside;
          let nameAdd = "";
          if (checkKCN === 1) nameAdd = "(Trong KCN)";
          else if (checkKCN === 2) nameAdd = "(Ngoài KCN)";

          return {
            ...el,
            usingPurposeName: `${el.usingPurposeName} ${nameAdd}`,
          };
        }) || [];
      dispatch(setUsingPurpose(usingPurposesOptions));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListAssetLevelOne = () => {
  return async (dispatch: any) => {
    try {
      const res = await assetCommonApi.getAssetLevel1();
      const assetLevelOne = res?.data || [];
      dispatch(setAssetLevelOne(assetLevelOne));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListBranch = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getCompanyBranchs();
      const listBranch = res?.data || [];
      dispatch(setBranch(listBranch));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListCompanyBranch = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getCompanyBranch();
      const listCompanyBranch = res?.data || [];
      dispatch(setCompanyBranch(listCompanyBranch));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListRegion = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getRegion();
      const listRegion = res?.data || [];
      dispatch(setRegion(listRegion));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getTransOffice = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getTransOffice();
      const listTransOffice = res?.data || [];
      dispatch(setTransoffice(listTransOffice));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListSacomUnit = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getSacombankUnit();
      const listSacomUnit = res?.data || [];
      dispatch(setSacomUnit(listSacomUnit));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListAppraisalPurpose = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getAppraisalPurposes();
      const listAppraisalPurpose = res?.data || [];
      dispatch(setAppraisalPurpose(listAppraisalPurpose));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListInfoSource = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getInfoSource();
      const resData = res?.data?.data || [];
      dispatch(setInfoSource(resData));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListCategoryCommon = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getCategoryCommon();
      const listCategoryCommon = res?.data?.data || [];
      dispatch(setCategoryCommon(listCategoryCommon));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListZone = () => {
  return async (dispatch: any) => {
    try {
      const res = await assetCommonApi.getZones();
      const listZone = res?.data || [];
      dispatch(setZone(listZone));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListPositionInPriceRange = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getPositionInRange();
      const listPositionInPriceRange = res?.data || [];
      dispatch(setPositionInRange(listPositionInPriceRange));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListContiguousType = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getRoadContiguousTypes();
      const listContiguousType = res?.data || [];
      dispatch(setContiguousType(listContiguousType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListAppraisalType = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getAppraisalTypes();
      const listAppraisalType = res?.data || [];
      dispatch(setAppraisalType(listAppraisalType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListLegalStatusRealEstate = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getLegalStatus("1");
      const listLegalStatus = res?.data || [];
      dispatch(setLegalStatusRealEstate(listLegalStatus));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListLegalStatusMovableEstate = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getLegalStatus("2");
      const listLegalStatus = res?.data || [];
      dispatch(setLegalStatusMovableEstate(listLegalStatus));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListCustomerType = () => {
  return async (dispatch: any) => {
    try {
      const res = await customerApi.getCustomerTypes();
      const listCustomerType = res?.data || [];
      dispatch(setCustomerType(listCustomerType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListJobType = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getJobTypes();
      const listJobType = res?.data || [];
      dispatch(setJobType(listJobType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListPriorityLevels = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getPriorityLevels();
      const listPriorityLevels = res?.data || [];
      dispatch(setPriorityLevel(listPriorityLevels));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListConstructionLegalType = () => {
  return async (dispatch: any) => {
    try {
      const res = await contructionApi.getConstructionLegalTypes();
      const listConstructionLegalType = res?.data || [];
      dispatch(setConstructionLegalType(listConstructionLegalType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListTreeType = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getTreeTypes();
      const listTreeType = res?.data || [];
      dispatch(setTreeType(listTreeType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListBusinessAdvantage = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getBusinessAdvantages();
      const listBusinessAdvantage = res?.data || [];
      dispatch(setBusinessAdvantage(listBusinessAdvantage));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListLiquidities = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getLiquidities();
      const listLiquidities = res?.data || [];
      dispatch(setLiquidities(listLiquidities));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListDataSource = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getDataSources();
      const listDataSource = res?.data?.data || [];
      dispatch(setDataSource(listDataSource));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListDataManufacturingCountry = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getManufacturingCountry();
      const listDataManufacturingCountry = res?.data || [];
      dispatch(setManufacturingCountry(listDataManufacturingCountry));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListDataRoadVehicleBrand = () => {
  return async (dispatch: any) => {
    try {
      const res = await brandApi.getAllBrandSearch({ type: 1, searchKey: "" });
      const listDataRoadVehicleBrand = res?.data?.data || [];
      dispatch(setRoadVehicleBrand(listDataRoadVehicleBrand));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListDataWaterVehicleBrand = () => {
  return async (dispatch: any) => {
    try {
      const res = await brandApi.getAllBrandSearch({ type: 2, searchKey: "" });
      const listDataWaterVehicleBrand = res?.data?.data || [];
      dispatch(setWaterVehicleBrand(listDataWaterVehicleBrand));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListRiskType = () => {
  return async (dispatch: any) => {
    try {
      const res = await categoryApi.getRiskTypes();
      const listRiskType = res?.data || [];
      dispatch(setRiskType(listRiskType));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListUtility = () => {
  return async (dispatch: any) => {
    try {
      const res = await systemApi.getListUtility();
      const listUtility = res?.data?.data || [];
      dispatch(setUtility(listUtility));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};
export const getListListRole = () => {
  return async (dispatch: any) => {
    try {
      const res = await approvalConfigsApi.getListRoles();
      const listRole = res?.data || [];
      dispatch(setListRole(listRole));
    } catch (error) {
      dispatch(setNetworkError(true));
    }
  };
};

export const startApp = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    await Promise.all([
      dispatch(getListAssetLevelOne()),
      dispatch(getListBranch()),
      dispatch(getListCompanyBranch()),
      dispatch(getListRegion()),
      dispatch(getTransOffice()),
      dispatch(getListCustomerType()),
      dispatch(getListProvince()),
      dispatch(getListPosition()),
      dispatch(getConstructionTypes()),
      dispatch(getListSacomUnit()),
      dispatch(getListInfoSource()),
      dispatch(getListUsingPurpose()),
      dispatch(getListCategoryCommon()),
      dispatch(getListZone()),
      dispatch(getListLegalStatusRealEstate()),
      dispatch(getListLegalStatusMovableEstate()),
      dispatch(getListAppraisalType()),
      dispatch(getListContiguousType()),
      dispatch(getListJobType()),
      dispatch(getListPriorityLevels()),
      dispatch(getListConstructionLegalType()),
      dispatch(getListTreeType()),
      dispatch(getListPositionInPriceRange()),
      dispatch(getListAppraisalPurpose()),
      dispatch(getListBusinessAdvantage()),
      dispatch(getListLiquidities()),
      dispatch(getListDataSource()),
      dispatch(getListDataManufacturingCountry()),
      dispatch(getListDataRoadVehicleBrand()),
      dispatch(getListDataWaterVehicleBrand()),
      dispatch(getListRiskType()),
      dispatch(getListUtility()),
      dispatch(getListListRole()),
    ]);

    dispatch(setLoading(false));
  };
};
