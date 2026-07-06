type NotifyType = {
  appraisalFileStatusHistoryId: string;
  appraisalFileId: string;
  modifyStaffUsername: string;
  modifyStaffDisplayName: string;
  proposalCode: string;
  reportCode: string;
  branchCode: string | null;
  changeDate: string;
  fromStatus: number;
  toStatus: number;
  status: number;
};

export type { NotifyType };
