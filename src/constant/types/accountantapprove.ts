import { Dayjs } from "dayjs";
type AccountantApprove = {
  completeDate?: string | Dayjs;
  documentId?: string;
  object?: string;
  name?: string;
  adress?: string;
  mst?: number;
  email?: string;
  quy?: string;
  spent?: string;
  money?: number;
  description?: string;
  month?: number;
  year?: number;
  day?: number;
  fullDay?: Dayjs;
};

type FilterAccountantApprove = {
  companyBranchId?: number;
  keyword?: string;
  typeOfDocument?: string;
  typeOfDocumentId?: number;
  staffId?: number;
  completeDate?: string | Dayjs;
  documentDate?: string | Dayjs;
  status?: number;
};

export type { FilterAccountantApprove, AccountantApprove };
