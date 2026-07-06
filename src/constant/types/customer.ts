type CustomerLegalDocumentType = {
  customerLegalDocumentTypeId: number;
  customerLegalDocumentType: string;
  requiredNumber: number;
  customerTypeId: number;
  assetLevelThreeId: number;
  description: string;
  isRequired: number;
  isDeleted: number;
};

type CustomerType = {
  customerId?: string | null;
  customerName: string;
  customerTypeId: number | null;
  taxCode: string | null;
  personIdentification: string | null;
  address: string | null;
  phoneNumber: string | null;
  representator: string | null;
  position: string | null;
  // createdStaffId?: string;
  status: number;
  dateCreate: string | null;
  dateModify: string | null;
  customerType: CustomerTypesType;
};

type CustomerTypeCreate = {
  customerId: string | null;
  customerName: string;
  customerTypeId: number | null;
  taxCode: string | null;
  personIdentification: string | null;
  address: string | null;
  phoneNumber: string | null;
  representator: string | null;
  position: string | null;
  // createdStaffId?: string;
  status: number;
  dateCreate: string | null;
  dateModify: string | null;
};

type CustomerTypesType = {
  customerTypeId: number | null;
  customerTypeName: string;
  description: string;
};

export type {
  CustomerLegalDocumentType,
  CustomerTypesType,
  CustomerType,
  CustomerTypeCreate,
};
