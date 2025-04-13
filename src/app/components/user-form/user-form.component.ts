import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { UserFormContent, RoleOption, UserFormOutput, UserForm } from '../../models';
import { roleOptions } from '../../ui_objects/roleOptions';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  @Input() content: UserFormContent;
  @Output() userUpdated: EventEmitter<UserFormOutput> = new EventEmitter();
  private _fb: FormBuilder = inject(FormBuilder);

  public roleOptions: RoleOption[] = roleOptions;
  public buttonText: string;
  public userForm: FormGroup<UserForm>;

  ngOnInit(): void {
    this.buttonText = `${this.content?.editMode ? 'Update': 'Add'} user`
    this.userForm = this._fb.group({
      username: new FormControl(this.content?.user?.username ?? '', [
        Validators.required,
        this._checkUserNameUniqueValidator(),
      ]),
      role: new FormControl(
        this.content?.user?.role ?? '',
        Validators.required
      ),
      enabled: new FormControl(
        this.content?.user?.enabled?.toString() ?? 'true',
        {
          nonNullable: true,
        }
      ),
    });
  }

  public updateUser(): void {
    const output: UserFormOutput = {
      ...this.userForm.getRawValue(),
      enabled: this.userForm.getRawValue().enabled === 'true',
    };
    this.userUpdated.emit(output);
    if (!this.content.editMode) {
      this.userForm.reset();
    }
  }

  private _checkUserNameUniqueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === this.content?.user?.username) {
        return null;
      }
      return control.value && this.content?.userNames?.includes(control.value)
        ? { userNameTaken: true }
        : null;
    };
  }
}
