type FilterAccountantCollectSpent = {
  keyword?: string;
  type?: string;
};

type CreateAccountantCollectSpent = {
  expentId: number | null;
  expentName: string | null;
  type: string | null;
  description: string | null;
  status: number | null;
};

type EditAccountantCollectSpent = {
  expentId?: number | null;
  expentName?: string | null;
  type?: string | null;
  description?: string | null;
  status?: number | null;
};

export type {
  FilterAccountantCollectSpent,
  CreateAccountantCollectSpent,
  EditAccountantCollectSpent,
};
