import type { Role } from "@/constants/roles";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
