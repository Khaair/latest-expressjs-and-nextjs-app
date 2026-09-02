export interface ApiErrorResponse {
  error: string;
  code?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}
