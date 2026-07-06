export type Customer = {
  customerId: string | null;
  customerName: string;
  customerTypeId: number;
  taxCode: string;
  personIdentification?: string;
  address: string;
  phoneNumber: string;
  representator?: string;
  position?: string;
  createdStaffId?: string;
  status: number;
  dateCreate?: string | null;
  dateModify?: string | null;
  customerType?: {
    customerTypeId: number;
    customerTypeName: string;
    description: string | null;
  };
};

export type CustomerType = {
  customerTypeId: string;
  customerTypeName: string;
  description: string;
};
