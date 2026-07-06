import { StaffType } from "./staff";

type SlaType = {
  key?: string;
  appraisalFileId: string;
  reportCode: string;
  appraisalDate?: string | null;
  address: string | null;
  staffs: StaffType;
  fileStatus: number;
  totalTimeDoing: string;
  status: string;
  isReceivedLos?: boolean | null;
  sendToEmail?: number | null;
  parentId?: string | null;
  refusedStatus?: number | null;
  maxCommitmentDate: number;
};

type FilterSlaType = {
  isFiltering?: boolean;
  dateFrom?: string | null;
  dateTo?: string | null;
  reportCode?: string;
  staffId?: string | null;
  fileStatus?: string | number;
  status?: string;
};

type SlaTimelineDetailItem = {
  finishedDate: string;
  staffName: string;
  staffUsername: string;
  startedDate: string | null;
  type: number;
};

type SlaTimelineDetail = Array<SlaTimelineDetailItem>;

export type {
  SlaType,
  FilterSlaType,
  SlaTimelineDetail,
  SlaTimelineDetailItem,
};
