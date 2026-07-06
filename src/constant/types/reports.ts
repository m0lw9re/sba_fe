type FilterReportFileComplete = {
  dateFrom: string | null;
  dateTo: string | null;

  regionCode?: string | null;
  appraisalUnit?: string;
};

type FilterReportCompletedFileTime = {
  dateFrom: string | null;
  dateTo: string | null;

  regionCode?: string;
  branchCode?: string;
  status?: string;
  appraisalUnit?: string;
};

type FilterReportCompletedFileDetail = {
  dateFrom: string | null;
  dateTo: string | null;
  staffId?: string;
  regionCode?: string;
  branchCode?: string;
  transOfficeCode?: string;
  status?: number;
  state?: number | null;
  addressProvince?: string | null;
  customerName?: string | null;
  surveyFrom?: string | null;
  surveyTo?: string | null;
  surveyName?: string;

  isIncome?: number;
  fileStatusId?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
};

type FilterChartQuantityFileArising = {
  month?: string;
  year?: string;

  appraisalUnit?: string;
};

type FilterQuantityFileArisingInMonth = {
  month?: string | null;
  year?: string | null;
  startDate: string | null;
  endDate: string | null;
  fileStatus?: string | null;
  staffId?: string | null;
  transOfficeCode?: string;

  approveStartDate: string | null;
  approveEndDate: string | null;
  customerName?: string;
  assetCode?: string;
  reportCode?: string;
  assetLevelOneId?: number;
  assetLevelTwoId?: number;
  assetLevelThreeId?: number;
  flowId?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
  fileStatusId?: string;
  proposalCode?: string;
  appraisalPurposeId?: string;
  unit?: string;
  rmName?: string;
  climsCode?: string;
  isReceivedLos?: boolean | string;
  feeStatus?: string;
  roleCode: string | null;
};

type FilterQuantityCancelFileArisingInMonth = {
  month?: string;
  year?: string;
  transOfficeCode?: string | null;
  provinceCode?: string;
  rmName?: string | null;
  filesStatus?: string | null;
  fileStatusId?: string | null;

  staffId?: string | null;
  appraisalUnit?: string;
};

type FilterReportWeek = {
  dateFrom: string | null;
  dateTo: string | null;
  regionCode?: string;
  companyBranchId?: string;

  appraisalUnit?: string;
};

type FilterReportDetailWeek = {
  startDate: string | null;
  endDate: string | null;
  regionCode?: string | null;

  appraisalUnit?: string;
};

type FilterReportTotalLate = {
  dateFrom: string | null;
  dateTo: string | null;
  regionCode?: string;
  companyBranchId?: string;

  appraisalUnit?: string;
};

type FilterReportDetailTotalLate = {
  startDate: string | null;
  endDate: string | null;
  regionCode?: string | null;

  appraisalUnit?: string;
};

type FilterAppraisalFilesByTime = {
  startDate?: number;
  endDate?: number;
  companyBranchId?: number | null;
  companyBranchName?: null | string;
  transOfficeCode?: string | null;
  username?: string | null;
  customerName?: string | null;
  province?: string;
  proposalDate?: number;
  fileStatusId?: string | null;
  appraisalUnit?: string;
};

type FilterProgressReports = {
  startDate?: number;
  endDate?: number;
  companyBranchId?: number | null;
  companyBranchName?: null | string;
  departmentId?: number | null;
  departmentName?: null | string;
  transOfficeCode?: string | null;
  username?: string | null;
  customerName?: string | null;
  province?: string;
  proposalDate?: number;
  fileStatusId?: string | null;
};

type FilterPersonalReports = {
  dateFrom: string | null;
  dateTo?: string | null;
  staffId?: string | null;
};

type FilterTotalReportDebt = {
  dateFrom: string | null;
  dateTo: string | null;
  companyBranchId?: number | null;
  companyBranchName?: null | string;
  regionCode?: string | null;
  regionName?: string | null;
  transOfficeCode?: string | null;
  transactionsName?: string | null;
  departmentId?: string | null;
  companyBranch?: number | null;
  unConfirmDebtTwo?: number | null;
};

type FilterFollowReportsDebt = {
  dateFrom: string | null;
  dateTo: string | null;
  regionCode?: string | null;
  companyBranchId?: string | null;
  staffId?: string | null;
  fileStatusId?: string;
  isExpiredDate?: number;
  reportCode?: string | null;
  companyBranch?: string | null;
};

type FilterReportAll = {
  startDate: string | null;
  endDate: string | null;
  approveStartDate: string | null;
  approveEndDate: string | null;
  customerName?: string;
  assetCode?: string;
  reportCode?: string;
  assetLevelOneId?: number;
  assetLevelTwoId?: number;
  assetLevelThreeId?: number;
  flowId?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
  fileStatusId?: string;
  proposalCode?: string;
  appraisalPurposeId?: string;
  unit?: string;
  rmName?: string;
  climsCode?: string;
  isReceivedLos?: boolean | string;
  feeStatus?: string;
  staffId?: string;
  year?: string | null;
};

type FilterChartReportKPI = {
  dateFrom?: string | null;
  dateTo?: string | null;
  isPass?: number | null;
  month?: string;
  year?: string;
  groupKpiId?: string | null;
  staffId?: string | null;
  appraisalUnit?: string | null;
};

type FilterReportDetailKPIInWeek = {
  dateFrom: string | null;
  dateTo: string | null;
  staffId: string | null;
  groupKpiId: number | null;
  appraisalUnit: string | null;
  percent?: string;
};

type FilterReportDetailKPIInMonth = {
  isCompleteKpi?: number | null;
  month: string | null;
  year: string | null;
  StaffId: string | null;
  groupKpiId: number | null;
  appraisalUnit?: string | null;
};

type FilterReportDebt = {
  dateFrom: string | null;
  dateTo: string | null;
};

type FilterDebtComparison = {
  dateFrom: string | null;
  dateTo: string | null;
  companyBranch?: number | null;
};

type FilterReportDebtMonthYear = {
  dateFrom: string | null;
  dateTo: string | null;
  companyBranch?: number | null;
  unConfirmDebtTwo?: number | null;
};

type FilterFollowDebtByStaff = {
  dateFrom: string | null;
  dateTo: string | null;
  regionCode?: string | null;
  transOfficeCode?: string | null;
  departmentId?: number | null;
  staffId?: string | null;
  isExpired?: number;
  companyBranch?: number | null;
};

type ExpandedDataType = {
  key: React.Key;
  reportCode: string;
  proposalDate: string;
  branchName: string;
  transOfficeName: string;
  rmPhone: number;
  customerName: string;
  address: string;
  transDate: string;
  totalValue: string;
  notReceiveResults: string;
  reduceFeeBusiness: string;
  gnnb: string;
  totalFee: string;
  reduce: string;
  profileExpired: string;
  remainMustCash: string;
  billOneTimeDate: string;
  billTwoTimeDate: string;
  debtAge: number;
};

type FilterReportTotalDebt = {
  dateFrom: string | null;
  dateTo: string | null;
  debtAge?: number | null;
  companyBranch?: number | null;
  unConfirmDebtTwo?: number | null;
};

type FilterDocToInv = {
  dateTo: string | null;
  unit?: string;
  reportCode?: string;
  customerName?: string;
  branchId?: string;
};

export type {
  FilterReportFileComplete,
  FilterReportCompletedFileDetail,
  FilterReportCompletedFileTime,
  FilterChartQuantityFileArising,
  FilterQuantityFileArisingInMonth,
  FilterQuantityCancelFileArisingInMonth,
  FilterReportWeek,
  FilterReportDetailWeek,
  FilterReportTotalLate,
  FilterReportDetailTotalLate,
  FilterAppraisalFilesByTime,
  FilterProgressReports,
  FilterPersonalReports,
  FilterTotalReportDebt,
  FilterFollowReportsDebt,
  FilterReportAll,
  FilterChartReportKPI,
  FilterReportDetailKPIInWeek,
  FilterDebtComparison,
  FilterFollowDebtByStaff,
  ExpandedDataType,
  FilterReportDebtMonthYear,
  FilterReportDetailKPIInMonth,
  FilterReportTotalDebt,
  FilterDocToInv,
};
