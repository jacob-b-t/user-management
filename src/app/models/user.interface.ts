import type { Timestamp } from "@angular/fire/firestore";

export interface UserFormOutput {
  username: string | null;
  role: string | null;
  enabled: boolean;
}

export interface User extends UserFormOutput {
  id?: string;
  createdAt?: Timestamp;
}