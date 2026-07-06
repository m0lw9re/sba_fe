import { AxiosResponse } from "axios";
import { SBAAxiosClient } from "./base";

export const sendApprovalAPI = {
  getReport: (id: string) => {
    let errorCount = 0;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const callApi = async (): Promise<AxiosResponse> => {
      try {
        const response = await SBAAxiosClient(`/report/api/v1/report/${id}`, {
          method: "GET",
          responseType: "blob",
        });
        return response;
      } catch (error) {
        errorCount++;
        if (errorCount >= 6) {
          throw error;
        }
        return delay(3000).then(callApi);
      }
    };
    return callApi();
  },
  sendApproval: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalSubmission/send`, {
      method: "POST",
      data,
    });
  },
  acceptApproval: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalSubmission/accept`, {
      method: "POST",
      data,
    });
  },
  cancelApproval: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalSubmission/cancel`, {
      method: "POST",
      data,
    });
  },
  getApprovalSubmission: (id: string) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalSubmission/${id}`, {
      method: "GET",
    });
  },
  getApprovalStaff: (id: string) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/approvalSubmission/findApprovalStaff/${id}`,
      {
        method: "GET",
      }
    );
  },
  getFileWithoutSign: (id: string, type: "inform" | "result") => {
    let errorCount = 0;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const callApi = async (): Promise<AxiosResponse> => {
      try {
        const response = await SBAAxiosClient(`/report/api/v1/${type}/${id}`, {
          method: "GET",
          responseType: "blob",
          timeout: 5 * 60 * 1000,
        });
        return response;
      } catch (error) {
        errorCount++;
        if (errorCount >= 10) {
          throw error;
        }
        return delay(3000).then(callApi);
      }
    };
    return callApi();
  },
  getFileWithSign: (id: string, type: "inform" | "result") => {
    let errorCount = 0;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const callApi = async (): Promise<AxiosResponse> => {
      try {
        // const response = await SBAAxiosClient(`/report/api/v1/result/signature`, {
        const response = await SBAAxiosClient(
          `/report/api/v1/signature/appraisal`,
          {
            params: {
              appraisalFilesId: id,
              page: type === "inform" ? 1 : 2,
            },
            method: "GET",
            responseType: "blob",
            timeout: 5 * 60 * 1000,
          }
        );
        return response;
      } catch (error) {
        errorCount++;
        if (errorCount >= 10) {
          throw error;
        }
        return delay(3000).then(callApi);
      }
    };
    return callApi();
  },
  requestFileSign: (id: string, type: "informSign" | "ResultSign") => {
    return SBAAxiosClient(`/report/api/v1/signature/appraisal`, {
      params: {
        appraisalFilesId: id,
        page: type === "informSign" ? 1 : 2,
      },
      method: "GET",
      responseType: "blob",
      timeout: 5 * 60 * 1000,
    });
  },
  uploadReportFile: (
    appraisalFileId: string,
    data: {
      customReportFileInfoId: null | number;
      reportEcmId: string | null;
      resultEcmId: string | null;
      informEcmId: string | null;
      assetType: number | null | undefined;
      fileReportName: string | null;
      fileResultName: string | null;
      fileInformName: string | null;
      totalValue: number | null;
    }
  ) => {
    return SBAAxiosClient(
      `/report/api/v1/report/upload?appraisalFileId=${appraisalFileId}`,
      {
        method: "POST",
        data,
      }
    );
  },
  adjustSigner: (data: { appraisalFileId: string; staffId: string }) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment/assignmentSignature`, {
      method: "POST",
      data,
    });
  },
  getMeetingReport: (id: string) => {
    let errorCount = 0;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const callApi = async (): Promise<AxiosResponse> => {
      try {
        const response = await SBAAxiosClient(
          `report/api/v1/councilmeetingreport/${id}`,
          {
            method: "GET",
            responseType: "blob",
          }
        );
        return response;
      } catch (error) {
        errorCount++;
        if (errorCount >= 6) {
          throw error;
        }
        return delay(3000).then(callApi);
      }
    };
    return callApi();
  },
};
