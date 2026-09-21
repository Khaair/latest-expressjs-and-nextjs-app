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

export interface BackendCreateUserBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  status?: BackendUser["status"];
}

export interface BackendUpdateUserBody {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: BackendUser["status"];
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendCategoriesData {
  categories: BackendCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackendCategoryData {
  category: BackendCategory;
}

export interface BackendCreateCategoryBody {
  name: string;
  slug?: string;
  description?: string;
}

export interface BackendUpdateCategoryBody {
  name?: string;
  slug?: string;
  description?: string | null;
}


export interface BackendBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendBlogsData {
  blogs: BackendBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackendBlogData {
  blog: BackendBlog;
}

export interface BackendCreateBlogBody {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  categoryId?: string | null;
}

export interface BackendUpdateBlogBody {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  published?: boolean;
  categoryId?: string | null;
}