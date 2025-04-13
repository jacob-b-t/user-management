import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserNotifyService } from '../../services';
import { RoleFormatterPipe } from '../../pipes/role-formatter.pipe';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService } from '../../services/user.service';
import type { User, UserFormOutput, UserModalContent } from '../../models';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    UserFormComponent,
    MatCardModule,
    MatButtonModule,
    RoleFormatterPipe,
    MatIconModule,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.scss',
})
export class UserDetailsModalComponent {
  private _userService: UserService = inject(UserService);
  private _userNotifyService: UserNotifyService = inject(UserNotifyService);
  constructor(@Inject(MAT_DIALOG_DATA) public data: UserModalContent) {}

  public updateUser(event: UserFormOutput): void {
    const update: User = {
      ...this.data.user,
      ...event,
    };
    this._userService.updateUser(update).subscribe({
      next: () => {
        this.data.user = update;
        this.data.editMode = false;
        this._userNotifyService.openNotification(
          `User: ${this.data.user.username} has been updated in the database`,
          'OK'
        );
      },
      error: () => {
        this._userNotifyService.openNotification(
          'An error updating a user has occurred, please try again',
          'OK'
        );
      },
    });
  }

  public editUser(val: boolean) {
    this.data.editMode = val;
  }
}
