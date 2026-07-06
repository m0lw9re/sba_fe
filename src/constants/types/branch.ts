export type Branch = {
    branchId: number;
    branchName: string;
    address: string;
    email: string;
    phoneNumber: string;
}

export type TransactionOffice = {
    transactionOfficeId: number;
    transactionOfficeName: string;
    address: string;
    email: string;
    phoneNumber: string;
    branchId: number;
}

export type CompanyBranch = {
    branchCode: string;
    branchName: string;
    address: string;
    email: string;
    phoneNumber: string;
}