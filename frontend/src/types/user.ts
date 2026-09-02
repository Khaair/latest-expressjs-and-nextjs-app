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
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}
