/**
 * Backend REST API contract (http://localhost:3001/api/v1)
 */
export interface BackendUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface BackendAuthData {
  user: BackendUser;
}

export interface BackendUsersData {
  users: BackendUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackendSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface BackendErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface BackendLoginBody {
  email: string;
  password: string;
}

export interface BackendRegisterBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
