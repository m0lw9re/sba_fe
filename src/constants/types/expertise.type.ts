import { Customer } from "constants/types/customer.type";

export type Expertise = {
    code: string;
    originProposalCode?: string;
    proposalTitle: string;
    proposalTypeId: number;
    proposalTypeName: string;
    appraisalOrgId: number;
    creditAgencyId: number;
    staffId?: number;
    staffName: string;
    approvedStaffId?: number;
    approvedStaffName: string;
    customerId: string;
    assetsQuantity: string;
    assetsInfo: string;
    assetsTypeId: number;
    assetsTypeName: string;
    dateCreate: string;
    dateModify: string;
    status: number;
    customer: Customer
}

export type GetDetailAppraisalFileParams = {
    id?: string;
}

export type GetDetailExpertiseParam = {
    id?: string;
}