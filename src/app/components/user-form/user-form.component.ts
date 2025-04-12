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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserFormContent } from '../../models';
import type { RoleOption } from '../../models/roleOption.interface';
import type { UserFormOutput } from '../../models/user.interface';
import type { UserForm } from '../../models/userForm.interface';
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
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  @Input() content: UserFormContent;
  @Output() userAdded: EventEmitter<UserFormOutput> = new EventEmitter();
  private _fb: FormBuilder = inject(FormBuilder);

  public roleOptions: RoleOption[] = roleOptions;

  public userForm: FormGroup<UserForm>;

  ngOnInit(): void {
    const enabled: boolean = this.content?.user?.enabled ?? true
    this.userForm = this._fb.group({
      username: new FormControl('', [
        Validators.required,
        this._checkUserNameUniqueValidator(),
      ]),
      role: new FormControl('', Validators.required),
      enabled: new FormControl(this.content?.user?.enabled ?? true, {nonNullable: true})
    });
  }

  public addUser(): void {
    this.userAdded.emit(this.userForm.getRawValue());
    this.userForm.reset();
  }

  private _checkUserNameUniqueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && this.content?.userNames.includes(control.value)
        ? { userNameTaken: true }
        : null;
    };
  };
}
