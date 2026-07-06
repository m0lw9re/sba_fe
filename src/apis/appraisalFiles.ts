import { SBAAxiosClient } from "./base";
import { CommonSearchAllParams } from "../constants/types/common.type";
import { AdditionalRequiredData, AppraisalFileType } from "constant/types";
import {
  AppraisalFileCreateType,
  AssetValuationType,
  CancelAppraisalFileData,
  RefuseToPriceData,
} from "constant/types/appraisalFile";
import {
  AccDataDto,
  AppraisalFilesCompareFilter,
  CollectFeeLOS,
  FeeNotificationType,
  ProfileExpenseLOS,
  FeeContentType,
  LockEditDataType,
} from "constant/types/appraisalFilesDetail";
import { handleConvertAssetLevelTwoId } from "utils/request/useCustomerDocumentType";
import { serialize } from "utils";

export const appraisalFilesApi = {
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiless/search", {
      method: "GET",
      params,
    });
  },
  getGoOrTo: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiles/staff/search", {
      method: "GET",
      params,
    });
  },
  getRefuseToPrice: (data: RefuseToPriceData, id: string) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiles/" + id, {
      method: "PUT",
      data,
    });
  },
  createAppraisalFileManual: (data: AppraisalFileCreateType) => {
    return SBAAxiosClient("/bussiness/api/v1/manual/appraisalFiles", {
      method: "POST",
      data,
    });
  },
  update: (data: AppraisalFileType) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiles", {
      method: "PUT",
      data,
    });
  },
  // hoàn thành tiếp nhận hồ sơ từ LOS
  updateByLos: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiles/edit_by_los", {
      method: "PUT",
      data,
    });
  },
  create: (data: FormData) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalFiles", {
      method: "POST",
      data,
    });
  },
  getFilesState: () => {
    return SBAAxiosClient("/bussiness/api/v1/filesStates", {
      method: "GET",
    });
  },
  getCustomerLegalDocumentTypes: (params: {
    customerTypeId?: number;
    assetLevelThreeId?: number;
  }) => {
    return SBAAxiosClient("/bussiness/api/v1/customerLegalDocumentTypes", {
      method: "GET",
      params,
    });
  },
  getLegalDocumentTypes: (params: {
    customerTypeId?: number;
    assetLevelTwoId?: number;
  }) => {
    return SBAAxiosClient("/bussiness/api/v1/legalDocumentTypes", {
      method: "GET",
      params: {
        ...params,
        assetLevelTwoId: handleConvertAssetLevelTwoId(
          params?.assetLevelTwoId || null
        ),
      },
    });
  },
  createAppraisalLegalDocument: (
    data: FormData,
    params: {
      customerLegalDocumentTypeId: number;
      appraisalFilesId: string;
      type: number;
    }
  ) => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalLegalDocument", {
      method: "POST",
      data,
      params,
    });
  },
  getAppraisalLegalDocument: (appraisalFilesId: string) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/appraisalLegalDocuments/" + appraisalFilesId,
      {
        method: "GET",
      }
    );
  },
  //Yêu cầu bổ sung hồ sơ
  getAdditionalRequired: (
    data: AdditionalRequiredData,
    appraisalFileId: string
  ) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/appraisalFiles/requestLegalDocument/" +
        appraisalFileId,
      {
        method: "POST",
        data,
      }
    );
  },
  deleteAppraisalLegalDocument: (appraisalLegalDocumentId: number) => {
    return SBAAxiosClient(
      "/api/v1/appraisalLegalDocument/" + appraisalLegalDocumentId,
      {
        method: "DELETE",
      }
    );
  },
  getFileTxt: (data: { type: string; fileName: string }) => {
    return SBAAxiosClient(
      "bussiness/api/v1/loadDocument/" + data.type + "/" + data.fileName,
      {
        method: "GET",
      }
    );
  },
  getAllAssetsDetail: (
    assetLevelTwoId: number,
    data: Array<{ assetCode: string }>
  ) => {
    return SBAAxiosClient(`/assets/api/v1/entire/${assetLevelTwoId}`, {
      method: "POST",
      data,
    });
  },
  updateAssetsEntire: (
    assetLevelTwoId: number,
    appraisalFileId: string,
    data: Array<any>
  ) => {
    return SBAAxiosClient(`/assets/api/v1/entire/${assetLevelTwoId}`, {
      method: "PUT",
      data,
      params: {
        appraisalFileId,
      },
    });
  },

  //Lưu thông tin tab giá trị tài sản
  updateAssetsValuation: (
    appraisalFileId: string,
    assetLevelTwoId: number,
    data: AssetValuationType
  ) => {
    return SBAAxiosClient(`/assets/api/v1/entire/valuation`, {
      method: "PUT",
      params: { appraisalFileId, assetLevelTwoId },
      data,
    });
  },
  //lấy thông tin phụ lục PPSS
  getAssetsValuationDetail: (params: {
    appraisalFileId: string;
    assetLevelTwoId: number | string;
    assetId: string;
    assetChildId: number;
    assetGrandChildId: number;
    valuationMethodDetailId: number | null;
    valuationMethodId: number | null;
  }) => {
    return SBAAxiosClient(`/assets/api/v1/entire/valuation/detail`, {
      method: "GET",
      params,
    });
  },

  //Cập nhật thông tin phụ lục PPSS
  updateAssetsValuationDetail: (
    params: {
      appraisalFileId: string;
      assetLevelTwoId: number | string;
      valuationMethodDetailId: number | string;
      valuationMethodId: number | string;
    },
    data: any
  ) => {
    return SBAAxiosClient(`/assets/api/v1/entire/valuation/detail`, {
      method: "PUT",
      params,
      data,
    });
  },

  //Lấy thông tin tài sản so sánh thêm mới
  getStoredAssets: (
    assetLevelTwoId: number,
    data: { assetIds: string[]; adjustCriteriaIds: any[] }
  ) => {
    return SBAAxiosClient(`/assets/api/v2/storedAsset/viewStoredAssets`, {
      method: "POST",
      params: { assetLevelTwoId },
      data: data,
    });
  },

  //Lấy thông tin bảng điều chỉnh thêm mới
  getAdjustTableCriteria: (
    params: {
      assetLevelTwoId: number | string;
      assetId: number | string;
      assetChildId: number | string;
      assetGrandChildId?: number | string;
    },
    data: { assetIds: string[]; adjustCriteriaIds: any[] }
  ) => {
    return SBAAxiosClient(`/assets/api/v1/entire/valuation/criteria`, {
      method: "POST",
      params,
      data: data,
    });
  },
  // get content bao phi
  getFeeNotificationContent: () => {
    return SBAAxiosClient(`/bussiness/api/v1/content/get_all`, {
      method: "GET",
    });
  },
  // Đồng ý phí
  confirmFee: (
    type: string,
    data: {
      maHoSo: string;
      trangThai: number;
      noiDung: [
        {
          reducedFee: null | number;
          note: string | null;
          dateModify: string | null;
        }
      ];
    }
  ) => {
    return SBAAxiosClient(`/bussiness/api/v1/mwork/pricequote/${type}`, {
      method: "PUT",
      data: data,
    });
  },
  // cập nhật báo phí đợt 1
  updateFeeNotification: (data: FeeNotificationType) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification`, {
      method: "POST",
      data,
    });
  },
  // cập nhật báo phí đợt 2
  updateFeeNotification2: (data: FeeNotificationType) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification`, {
      method: "POST",
      data,
    });
  },
  updateFeeNotificationInfo: (
    data: FeeNotificationType,
    needLock: boolean = false
  ) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/feeNotification/edit?needLock=${needLock}`,
      {
        method: "PUT",
        data,
      }
    );
  },

  updateDebtFeeNotificationInfo: (data: FeeContentType[]) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/edit_nvoice`, {
      method: "PUT",
      data,
    });
  },

  updateStatusMail: (data: FeeNotificationType) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/edit_email`, {
      method: "PUT",
      data,
    });
  },

  deleteFeeNotificationInfo: (
    feeNotificationId: string | null,
    feeContentId: number | string | null
  ) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/feeNotification/${feeNotificationId}/delete/${feeContentId}`,
      {
        method: "DELETE",
      }
    );
  },

  updateFeeNotificationInfoToLOS: (feeNotificationId: string) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/bao_phi_los`, {
      method: "POST",
      params: { feeNotificationId },
    });
  },

  updateInternalRecord: (data: {
    internalRecordType: number;
    feeNotificationId: string;
    appraisalFileId: string;
    feeContentId: number;
    received: number;
    receiveDate: string | null;
  }) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/internalRecord`, {
      method: "PUT",
      data,
    });
  },

  sendMailToLOS: (appraisalFileId: string | undefined) => {
    return SBAAxiosClient(`/bussiness/api/v1/email/fee`, {
      method: "POST",
      params: { appraisalFileId },
    });
  },

  //hoan thanh KS
  completeSurvey: (appraisalFileId: string, data: Array<any>) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/completeSurvey/${appraisalFileId}`,
      {
        method: "PUT",
        data,
      }
    );
  },

  //xuat bien ban khao sat
  exportSurveyReport: (data: {
    appraisalFileId: string;
    typeExport: Array<number>;
  }) => {
    return SBAAxiosClient("/assets/api/v1/surveyReport/surveyReport", {
      method: "POST",
      data,
      responseType: "blob",
    });
  },
  // hoàn thành biên bản khảo sát
  completeSurveyReport: (data: {
    appraisalFileId: string;
    imagesurveyGuideSign: string;
    imageStaffSign: string;
    typeExport: Array<number>;
  }) => {
    return SBAAxiosClient("/assets/api/v1/surveyReport/successSurveyReport", {
      method: "POST",
      data,
      responseType: "blob",
    });
  },

  //Lấy giá trị bảng dòng tiền trong phụ lục PPTN - nhà đất
  getDataGrowthTable: (data: { data: any }) => {
    return SBAAxiosClient("/assets/api/v1/assetLand/growthTable", {
      method: "POST",
      data,
    });
  },

  //Xuất phiếu in
  exportReportPrint: (appraisalFileId: string) => {
    return SBAAxiosClient({
      url: `/report/api/v1/report/phieu-tham-dinh/${appraisalFileId}`,
      method: "GET",
      responseType: "blob",
    });
  },
  // upload BBKS
  uploadBBKS: (data: FormData) => {
    return SBAAxiosClient(`/assets/api/v1/surveyReport/upload`, {
      method: "POST",
      data,
    });
  },
  getRefusalToPriceReason: (appraisalFileId: string) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/appraisalHistoryRefusal/${appraisalFileId}`,
      {
        method: "GET",
      }
    );
  },
  //thu tien bao LOS
  getMoneyForLOS: (data: CollectFeeLOS) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/feeNotification/thu_tien_bao_phi_los`,
      {
        method: "POST",
        data,
      }
    );
  },
  getAccFromEMS: (data: AccDataDto) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/forEms/search`, {
      method: "GET",
      params: data,
    });
  },
  joinFeeNotification: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/merge`, {
      method: "POST",
      data: data,
    });
  },
  getAppraisalFromEMS: (data: AppraisalFilesCompareFilter) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/appraisalFiles/forEms/search/nhs`,
      {
        method: "GET",
        params: data,
      }
    );
  },
  // yêu cầu thu tiền sang EMS
  sendPaymentRequest: (data: ProfileExpenseLOS) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/profileExpense`, {
      method: "POST",
      data,
    });
  },
  //xuất hóa đơn sang LOS
  setProfileExpense: (data: ProfileExpenseLOS) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/profileExpense`, {
      method: "PUT",
      data,
    });
  },
  //Thu hồi xuất hóa đơn sang LOS
  unProfileExpense: (data: ProfileExpenseLOS) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/delete_hd_ems`, {
      method: "POST",
      data,
    });
  },
  exportMail: (data: ProfileExpenseLOS) => {
    return SBAAxiosClient(`/bussiness/api/v1/email/exportBill`, {
      method: "POST",
      data,
    });
  },
  sendProfilesToEms: (data: any[]) => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/forEms/sendEms`, {
      method: "POST",
      data,
    });
  },
  //Tai dinh gia
  rePricing: (appraisalFileIds: Array<string>) => {
    return SBAAxiosClient(`/bussiness/api/v1/appraisalFiles/renewList`, {
      method: "POST",
      data: appraisalFileIds,
    });
  },

  // khoa chinh sua phi; isLocked = false => unlock
  lockEditFee: (data: {
    feeNotificationId: string;
    isLocked: boolean;
    feeContentIds: Array<{ id: string; isFirst: boolean }>;
  }) => {
    return SBAAxiosClient("/bussiness/api/v1/feeNotification/lock_edit", {
      method: "POST",
      data,
    });
  },

  //Huỷ hò sơ
  cancelAppraisalFile: (data: CancelAppraisalFileData) => {
    return SBAAxiosClient(`/bussiness/api/v1/appraisalFiles/cancel`, {
      method: "PUT",
      data,
    });
  },

  //Lấy danh sách hồ sơ thay thế
  listAppraisalFileReplace: () => {
    return SBAAxiosClient(`/bussiness/api/v1/feeNotification/get_all_paid`, {
      method: "GET",
    });
  },

  //lock unlock appraisal
  lockEdit: (lockEditData: LockEditDataType) => {
    return SBAAxiosClient(`/bussiness/api/v1/appraisalFiles/lock_edit`, {
      method: "POST",
      data: lockEditData,
    });
  },

  //Gửi TB, KQ kèm file trong CTDTCN
  sendTBKQ: (data: {
    appraisalFileId: string;
    dateSendEmail?: string | null;
    type: number;
    listDocument: any[];
  }) => {
    return SBAAxiosClient("/bussiness/api/v1/email/manual", {
      method: "POST",
      data,
    });
  },
};
