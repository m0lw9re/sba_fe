export type JobTypeType = { 
  jobTypeId: number; 
  jobTypeName: string 
};
export type PriorityLevelType = {
  id: number;
  name: string;
};
export type AssignmentType = {
  appraisalFileId: string;
  assignmentId: number;
  companyBranch: {
    companyBranchId: number;
    companyBranchName: string;
    address: string;
    code: string;
  };
  companyBranchId: number;
  jobAssigner: string;
  jobType: JobTypeType;
  jobTypeId: number;
  priorityLevel: number;
  staffs: Array<string>;
  status: number;
  timeAssigned: string | null;
  timeEnd: string | null;
};

export type CreateAssignmentType = {
  appraisalFileId: string;
  staffs: string | null;
  jobTypeId: number | null;
  companyBranchId: number | null;
  priorityLevel: number | null;
  note: string | null;
};

export type UpdateAssignmentType = {
  appraisalFileId: string;
  assignmentId: number;
  companyBranch: {
    companyBranchId: number;
    companyBranchName: string;
    address: string;
    code: string;
  };
  companyBranchId: number;
  jobAssigner: string;
  jobType: JobTypeType;
  jobTypeId: number;
  priorityLevel: number;
  staffs: string;
  status: number;
  timeAssigned: string | null;
  timeEnd: string | null;
};
