import { CategoryConfigApproveType } from "constant/types/categoryConfigApprove";
import { SBAAxiosClient } from "./base";
import {
  CategoryDayOffsType,
  CategoryFeeCreateAndUpdateType,
  KPIBonusCoefficientCreateType,
} from "constant/types/categories";
import { GetAllCommonType, KPIsByGroup } from "constant/types";
import { serialize } from "utils";

export const categoryApi = {
  getSacombankUnit: () => {
    return SBAAxiosClient("/bussiness/api/v1/common/unit", {
      method: "GET",
    });
  },
  getTransOffice: () => {
    return SBAAxiosClient("/bussiness/api/v1/transactionOffices/get_all", {
      method: "GET",
    });
  },

  getFlows: () => {
    return SBAAxiosClient("/bussiness/api/v1/common/flows", {
      method: "GET",
    });
  },
  getCompanyBranchs: () => {
    return SBAAxiosClient("/bussiness/api/v1/common/companyBranchs", {
      method: "GET",
    });
  },
  getCompanyBranch: () => {
    return SBAAxiosClient("/bussiness/api/v1/branches/", {
      method: "GET",
    });
  },
  getRegion: () => {
    return SBAAxiosClient("/bussiness/api/v1/Region/getAll", {
      method: "GET",
    });
  },
  getfileStatus: () => {
    return SBAAxiosClient("/bussiness/api/v1/common/fileStatus", {
      method: "GET",
    });
  },

  //Loại đường tiếp giáp
  getRoadContiguousTypes: () => {
    return SBAAxiosClient("/assets/api/v1/roadContiguousTypes", {
      method: "GET",
    });
  },
  //Vị trí trong khung giá
  getPositionInPriceRanges: () => {
    return SBAAxiosClient("/assets/api/v1/positionInPriceRanges", {
      method: "GET",
    });
  },

  //lây CBRR
  getRiskTypes: () => {
    return SBAAxiosClient("/assets/api/v1/riskTypes", {
      method: "GET",
    });
  },

  //lấy CBRR theo ts cấp 2
  getRiskTypesByAssetLevelTwo: (assetLevelTwoId: string | number) => {
    return SBAAxiosClient(`/assets/api/v1/riskAssets/${assetLevelTwoId}`, {
      method: "GET",
    });
  },

  //Lấy loại thông tin pháp lý
  getLegalInformationTypes: (assetLevelTwoId: string | number = 1) => {
    return SBAAxiosClient(
      `/assets/api/v1/legalInformationTypes/${assetLevelTwoId}`,
      {
        method: "GET",
      }
    );
  },

  //Lấy mục đích SD đất
  getUsingPurpose: (assetLevelTwoId?: string | number) => {
    //sau BE fix thi dung cai nay
    // return SBAAxiosClient(`/assets/api/v1/usingPurpose/${assetLevelTwoId}`, {
    //   method: "GET",
    // });
    //chinh sua tam thoi

    return SBAAxiosClient(
      `/assets/api/v1/usingPurpose/get_all?limit=1000&page=1&status=true`,
      {
        method: "GET",
      }
    );
  },

  //Lấy danh mục hồ sơ pháp lý
  getLegalDocumentTypes: (assetLevelTwoId: string | number) => {
    return SBAAxiosClient(
      `/assets/api/v1/legalDocumentTypes/${assetLevelTwoId}`,
      {
        method: "GET",
      }
    );
  },

  // lấy bước thực hiện công việc
  getJobTypes: () => {
    return SBAAxiosClient(`/bussiness/api/v1/jobTypes`, {
      method: "GET",
    });
  },

  //Lấy độ ưu tiên
  getPriorityLevels: () => {
    return SBAAxiosClient(`/bussiness/api/v1/priorityLevels`, {
      method: "GET",
    });
  },

  //Lấy DS nhân viên để phân công
  getStaffForAssign: (jobTypeId: number, companyBranchId: number) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment/getstaff`, {
      method: "GET",
      params: {
        jobTypeId,
        companyBranchId,
      },
    });
  },

  // lấy khu vực
  getZones: () => {
    return SBAAxiosClient(`/assets/api/v1/zones`, {
      method: "GET",
    });
  },

  // Ngày nghỉ trong năm
  getDayOffsUSer: (data: CategoryDayOffsType) => {
    return SBAAxiosClient(`/admin/api/v1/holidayInYear/getAll`, {
      method: "GET",
      params: data,
    });
  },
  createDayOffs: (data: CategoryDayOffsType) => {
    return SBAAxiosClient(`/admin/api/v1/holidayInYear`, {
      method: "POST",
      data,
    });
  },
  updateDayOffs: (data: CategoryDayOffsType) => {
    return SBAAxiosClient(`/admin/api/v1/holidayInYear`, {
      method: "PUT",
      data,
    });
  },
  deleteDayOffs: (id: string) => {
    return SBAAxiosClient(`/admin/api/v1/holidayInYear/${id}`, {
      method: "DELETE",
    });
  },

  // cập nhật luồng phê duyệt
  updateApproveConfig: (data: CategoryConfigApproveType[]) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalConfigValue`, {
      method: "PUT",
      data,
    });
  },

  // Khung gía xuất vốn
  getConstructionTypes: () => {
    return SBAAxiosClient("/assets/api/v1/constructionTypes", {
      method: "GET",
    });
  },
  createConstructionName: async (data: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionName`, {
      method: "POST",
      data,
    });
  },
  updateConstructionName: async (data: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionName`, {
      method: "PUT",
      data,
    });
  },
  deleteConstructionName: async (id: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionName/${id}`, {
      method: "DELETE",
    });
  },
  // KPI
  createKpiGroup: async (data: any) => {
    return await SBAAxiosClient(`/assets/api/v1/KpiGroup`, {
      method: "POST",
      data,
    });
  },
  updateKpiGroup: (data: any) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup`, {
      method: "PUT",
      data,
    });
  },
  deleteKpiGroup: (id: any) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup/${id}`, {
      method: "DELETE",
    });
  },
  getListEmp: async () => {
    const res = await SBAAxiosClient(`/assets/api/v1/EmpKpiGroup`, {
      method: "GET",
    });
    return res.data;
  },
  getListEmpOfGroup: async (kpiGroupId: any) => {
    const res = await SBAAxiosClient(`/assets/api/v1/EmpKpi/${kpiGroupId}`, {
      method: "GET",
    });
    return res;
  },
  setListEmpOfGroup: async (kpiGroupId: any, data: any) => {
    const res = await SBAAxiosClient(
      `/assets/api/v1/EmpKpiGroup?kpiGroupId=${kpiGroupId}`,
      {
        method: "POST",
        data,
      }
    );
    return res;
  },
  // quy đổi hệ số
  postConvertIndex: async (data: any) => {
    const res = await SBAAxiosClient(`/assets/api/v1/ProfileCoefficient`, {
      method: "POST",
      data,
    });
    return res.data;
  },
  updateConvertIndex: (data: any) => {
    return SBAAxiosClient(`/assets/api/v1/ProfileCoefficient`, {
      method: "PUT",
      data,
    });
  },
  deleteConvertIndex: (id: any) => {
    return SBAAxiosClient(`/assets/api/v1/ProfileCoefficient/${id}`, {
      method: "DELETE",
    });
  },

  // tiêu chí đánh giá
  postCriteria: async (data: any) => {
    const res = await SBAAxiosClient(`/assets/api/v1/EvaluationCriteria`, {
      method: "POST",
      data,
    });
    return res.data;
  },
  updateCriteria: (data: any) => {
    return SBAAxiosClient(`/assets/api/v1/EvaluationCriteria`, {
      method: "POST",
      data,
    });
  },
  deleteCriteria: (id: any) => {
    return SBAAxiosClient(`/assets/api/v1/EvaluationCriteria/${id}`, {
      method: "DELETE",
    });
  },
  // Lấy vị trí
  getPositions: () => {
    return SBAAxiosClient("/assets/api/v1/positions", {
      method: "GET",
    });
  },
  //Thêm mới biểu phí định giá
  createFeeSchedule: (data: CategoryFeeCreateAndUpdateType) => {
    return SBAAxiosClient("/bussiness/api/v1/feeSchedule", {
      method: "POST",
      data,
    });
  },

  //Cập nhật biểu phí định giá
  updateFeeSchedule: (data: CategoryFeeCreateAndUpdateType) => {
    return SBAAxiosClient("/bussiness/api/v1/feeSchedule", {
      method: "PUT",
      data,
    });
  },

  //Xóa biểu phí định giá
  deleteFeeSchedule: (feeSchedule: number) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeSchedule/${feeSchedule}`, {
      method: "DELETE",
    });
  },

  //Lấy danh sách biểu phí định giá
  getFeeSchedules: (
    params: {
      keyword?: string;
      page?: number;
      limit?: number;
      fileBehaviorId?: number;
    },
    data: Array<number>
  ) => {
    return SBAAxiosClient("/bussiness/api/v1/feeSchedules", {
      method: "POST",
      params,
      data,
    });
  },
  // Hồ sơ pháp lý
  createLegalDoc: async (data: any) => {
    const res = await SBAAxiosClient(
      `/bussiness/api/v1/customerLegalDocumentType`,
      {
        method: "POST",
        data,
      }
    );
    return res;
  },
  updateLegalDoc: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/customerLegalDocumentType`, {
      method: "PUT",
      data,
    });
  },
  deleteLegalDoc: (id: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/customerLegalDocumentType/${id}`, {
      method: "DELETE",
    });
  },

  //lấy đoạn dường trong khung giá
  getRoadInPrices: (provinceCode: any) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/roadInPrice/get_by_provinceCode/${provinceCode}`,
      {
        method: "GET",
        params: { provinceCode },
      }
    );
  },

  // công tác phí
  createBussinessFee: async (data: any) => {
    const res = await SBAAxiosClient(`/bussiness/api/v1/feeBusiness`, {
      method: "POST",
      data,
    });
    return res;
  },
  updateBussinessFee: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeBusiness`, {
      method: "PUT",
      data,
    });
  },
  deleteBussinessFee: (id: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeBusiness/${id}`, {
      method: "DELETE",
    });
  },

  //Lấy mục đích thẩm định
  getAppraisalPurposes: () => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalPurposes", {
      method: "GET",
    });
  },

  //Lấy loại công trình xây dựng
  getContructionType: () => {
    return SBAAxiosClient("/assets/api/v1/constructionTypes", {
      method: "GET",
    });
  },

  getInfoSource: () => {
    return SBAAxiosClient("/assets/api/v1/sourceInfo", {
      method: "GET",
    });
  },

  getCategoryCommon: () => {
    return SBAAxiosClient("/assets/api/v1/commonCategory", {
      method: "GET",
    });
  },

  getPositionInRange: () => {
    return SBAAxiosClient("/assets/api/v1/positionInPriceRanges", {
      method: "GET",
    });
  },
  getAppraisalTypes: () => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalTypes", {
      method: "GET",
    });
  },
  getLegalStatus: (type: "1" | "2") => {
    //type = 1 BDS
    //type = 2 DS
    return SBAAxiosClient(`/bussiness/api/v1/legalStatusByType?type=${type}`, {
      method: "GET",
    });
  },
  getTreeTypes: () => {
    return SBAAxiosClient("/assets/api/v1/treeTypes", {
      method: "GET",
    });
  },
  getBusinessAdvantages: () => {
    return SBAAxiosClient("/assets/api/v1/bussinessAdvantages", {
      method: "GET",
    });
  },
  getLiquidities: () => {
    return SBAAxiosClient("/assets/api/v1/liquidities", {
      method: "GET",
    });
  },
  getDataSources: () => {
    return SBAAxiosClient("/assets/api/v1/sourceData", {
      method: "GET",
    });
  },
  getManufacturingCountry: () => {
    return SBAAxiosClient("/assets/api/v1/countrys/search", {
      method: "GET",
    });
  },

  getGroupKPI: (params?: GetAllCommonType, data?: KPIsByGroup) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup/searchKpiGroup`, {
      method: "GET",
      params,
      data,
    });
  },

  getListProjectApartment: (params?: { name: string }) => {
    return SBAAxiosClient(
      `/assets/api/v1/apartment/detail/projects?${serialize(params)}`,
      {
        method: "GET",
        params,
      }
    );
  },

  getListBuildingApartment: (params: { projectId: string; name?: string }) => {
    return SBAAxiosClient(`/assets/api/v1/apartment/detail/building`, {
      method: "GET",
      params,
    });
  },

  getListBlockApartment: (params: {
    projectId: string;
    buildingId: string;
    name?: string;
  }) => {
    return SBAAxiosClient(`/assets/api/v1/apartment/detail/blocks`, {
      method: "GET",
      params,
    });
  },

  createKPIBonusCoefficient: (data: KPIBonusCoefficientCreateType) => {
    return SBAAxiosClient("/assets/api/v1/KPIBonusCoefficient", {
      method: "POST",
      data,
    });
  },

  updateKPIBonusCoefficient: (data: KPIBonusCoefficientCreateType) => {
    return SBAAxiosClient(`/assets/api/v1/KPIBonusCoefficient`, {
      method: "POST",
      data,
    });
  },

  deleteKPIBonusCoefficient: (id: string) => {
    return SBAAxiosClient(`/assets/api/v1/KPIBonusCoefficient/${id}`, {
      method: "DELETE",
    });
  },

  // danh mục công trình xây dưng
  createCategoryConstruction: async (data: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionTypes`, {
      method: "POST",
      data,
    });
  },
  updateCategoryConstruction: async (data: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionTypes`, {
      method: "PUT",
      data,
    });
  },
  deleteCategoryConstruction: async (id: any) => {
    return await SBAAxiosClient(`/assets/api/v1/constructionTypes/${id}`, {
      method: "DELETE",
    });
  },
};
