import { User } from "./user.interface";

export interface UserModalContent extends User {
  editMode: boolean;
  userNames: string[];
}