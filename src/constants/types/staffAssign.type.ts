export type StaffAssign ={
    appraisalFilesId: string;
    staffId: string | null;
    description?: string;
    isReAssign: boolean;
} 

export type ReportApproval = {
    reportId: string;
    appraisalFilesId: string;
    approve: boolean;
    failedStep?: number;
    description?: string;
}