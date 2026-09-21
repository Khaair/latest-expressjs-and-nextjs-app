export interface User {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}
