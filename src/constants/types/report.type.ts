import { UploadFile } from "antd";

export type IdReport = {
  appraisalFilesId: string;
  name?: string;
};

export type ParamDownLoadFile = {
  type: string;
  fileName: string;
};

export type DataUpLoadFile = {
  file: UploadFile;
};

export type ParamUpLoadFile = {
  appraisalFilesId: string;
  description: string;
  data: DataUpLoadFile;
};

export type ParamsDelete = {
  reportId: string;
};

export type Report = {
  reportId: string;
  reportName: string;
  appraisalFilesId: string;
  fileName: string;
  reporter: string;
  reporterName: string;
  approver: string;
  approverName: string;
  description: string;
  status: number;
  statusName: string;
  deleted: number;
  dateUpload: Date;
  dateApproval: Date | null;
};

export type ReportUpdateParam = {
  reportId: string;
  isApprove: boolean;
  status: number;
};

export type FilterReportType = {
  keyword?: string;
  status?: number;
  start?: number;
  end?: number;
};
