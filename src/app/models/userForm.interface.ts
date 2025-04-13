import { FormControl } from "@angular/forms";
import { User } from "./user.interface";

export interface UserForm {
  username: FormControl<string | null>;
  role: FormControl<string | null>;
  enabled: FormControl<string>;
}
export interface UserFormContent {
  userNames: string[];
  editMode?: boolean;
  user?: User;
}