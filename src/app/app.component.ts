import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {
  HeroComponent,
  UserDetailsModalComponent,
  UserFormComponent,
  UserTableComponent,
} from './components';
import type { User, UserFormOutput } from './models/user.interface';
import { UserService, UserNotifyService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    HeroComponent,
    UserFormComponent,
    MatProgressSpinnerModule,
    UserTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _dialogue: MatDialog = inject(MatDialog);
  private _userNotifyService: UserNotifyService = inject(UserNotifyService)
  public userService = inject(UserService);

  public title = 'user-management-fe';
  public users$: Observable<User[]> = this.userService.getUsers();
  public heroHeader: string = 'User Managment';

  public userAddedClicked(event: UserFormOutput): void {
    this.userService.addUser(event).subscribe({
      next: (res) => {
        this._userNotifyService.openNotification(`New ${res.role}: ${res.username} has been added to the database`, 'OK')
      },
      error: () => {
        this._userNotifyService.openNotification('An error adding a user has occurred, please try again', 'OK')
      },
    });
  }

  public openEdit(event: User, inEdit: boolean): void {
    this._dialogue.open(UserDetailsModalComponent, {
      data: {
        user: event,
        editMode: true,
        userNames: this.userService.userNames(),
      },
      height: '75%',
      width: '75%',
    });
  }
}
