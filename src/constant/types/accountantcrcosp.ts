import { Dayjs } from "dayjs";
type AccountantCreateCoSp = {
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

type UploadFile = {
  key?: string;
  descriptions: string;
  attachments: string;
};

type FilterCreateCollectSpent = {
  companyBranchId?: number;
  keyword?: string;
  typeOfDocument?: string;
  staffId?: number;
  completeDate?: string | Dayjs;
  documentDate?: string | Dayjs;
  status?: number;
};

export type { FilterCreateCollectSpent, AccountantCreateCoSp, UploadFile };
