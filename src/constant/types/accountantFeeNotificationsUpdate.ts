type FilterAccountantFeeNotificationsUpdate = {
  startDate: string | null
  endDate: string | null
  keyword?: string;
  type?: string;
  locationId?: number;
  statusId?: number;
  daThu?: number;
  natureId?: string;
  branchName?: string | null;
  congNo?: number;
  price?: number;
  whoCreate?: string | null;
  isFiltering?: boolean;
  reportCode?: string | null;
  proposalCode?: string | null;
};

type CreateAccountantFeeNotificationsUpdate = Partial<{
  soTB: string | null;
  ngayTB: string | null;
  nguoiLap: string | null;
  soBT: string | null;
  trangThai: string | null;
  soCTGoc: string | null;
  location: string | null;
  object: string | null;
  fullName: string | null;
  email: string | null;
  address: string | null;
  nature: string | null;
  taxCode: string | null;
  status: number;
  description: string | null;
  type: string | null;
  expentName: string | null;
  expentId: string | null;
}>;

type EditAccountantFeeNotificationsUpdate = {
  expentId?: number | null;
  expentName?: string | null;
  type?: string | null;
  description?: string | null;
  status?: number | null;
};

export type {
  FilterAccountantFeeNotificationsUpdate,
  CreateAccountantFeeNotificationsUpdate,
  EditAccountantFeeNotificationsUpdate,
};
