import {
  IdReport,
  ParamDownLoadFile,
  ParamsDelete,
  ReportUpdateParam,
} from "constants/types/report.type";
import { SBAAxiosClient } from "./base";

export const reportAPI = {
  getReport: (params: IdReport) => {
    return SBAAxiosClient(`/report/api/v1/report/${params.appraisalFilesId}`, {
      method: "GET",
    });
  },
  getInform: (params: { id: string }) => {
    return SBAAxiosClient(`/report/api/v1/inform/${params.id}`, {
      method: "GET",
    });
  },
  downLoadFileReport: (params: ParamDownLoadFile) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/downloadFile/${params.type}/${params.fileName}`,
      {
        method: "GET",
        responseType: "blob",
      }
    );
  },
  postFileReport: (data?: FormData) => {
    return SBAAxiosClient(`/report/api/v1/report`, {
      method: "POST",
      data,
    });
  },
  getListReport: (params: IdReport) => {
    return SBAAxiosClient(`/report/api/v1/reports/${params.appraisalFilesId}`, {
      method: "GET",
    });
  },
  getListReportWaitApprove: (params: IdReport) => {
    return SBAAxiosClient(`/report/api/v1/reports/waitApprove/${params.appraisalFilesId}`, {
      method: "GET",
    });
  },
  deleteReport: (params?: ParamsDelete) => {
    return SBAAxiosClient(`/report/api/v1/report/${params?.reportId}`, {
      method: "DELETE",
    });
  },
  updateReport: (params?: ReportUpdateParam)=>{
    return SBAAxiosClient(`/report/api/v1/report`, {
      method: "PUT",
      params,
    });
  }
};
