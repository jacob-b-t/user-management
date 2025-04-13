import { User } from "./user.interface";

export interface UserModalContent {
  user: User;
  editMode: boolean;
  userNames: string[];
}