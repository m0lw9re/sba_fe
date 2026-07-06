import { Dayjs } from "dayjs";

type FilterCategoryKpis = {
  fromDate: string | null;
  toDate: string | null;
  kpiGroupId?: string;
};

type FilterStaff = {
  dateFrom: string | null;
  dateTo: string | null;
  kpiGroupId?: string;
};

type StaffByGroup = {
  staffNumber: string | null;
  staffId: string;
  staffName: string;
  kpiGroupId: string;
  kpiGroupName: string;
  dateFrom: string | null;
  dateTo: string | null;
  departmentId: string;
  departmentName: string;
};

type KPIsByGroup = {
  annualRevenue?: string;
  kpiGroupId?: string;
  kpiGroupName?: string;
  kpiHSMonth?: string;
  kpiHSYear?: string;
  monthlyRevenue?: string;
  fromDate?: string | null | Dayjs;
  toDate?: string | null | Dayjs;
};

type KPIType = {
  kpiGroupId?: any;
  kpiGroupName?: any;
};

type FilterConvertProfileCoefficient = {
  type?: string;
};

export type {
  FilterCategoryKpis,
  FilterConvertProfileCoefficient,
  StaffByGroup,
  KPIsByGroup,
  FilterStaff,
  KPIType,
};
