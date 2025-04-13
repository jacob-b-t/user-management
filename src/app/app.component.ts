import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import {
  HeroComponent,
  UserDetailsModalComponent,
  UserFormComponent,
  UserTableComponent,
  UserSearchComponent,
} from './components';
import { UserService, UserNotifyService } from './services';
import type { User, UserFormOutput } from './models/user.interface';

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
    UserSearchComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _dialogue: MatDialog = inject(MatDialog);
  private _userNotifyService: UserNotifyService = inject(UserNotifyService);
  public userService = inject(UserService);

  public title = 'user-management-fe';
  public users$: Observable<User[]> = this.userService.getUsers();
  public heroHeader: string = 'User Managment';

  public userAddedClicked(event: UserFormOutput): void {
    this.userService.addUser(event).subscribe({
      next: (res) => {
        if (res !== null) {
          this._userNotifyService.openNotification(
            `New ${res.role}: ${res.username} has been added to the database`,
            'OK'
          );
        } else {
          this._userNotifyService.openNotification(
            'An error adding a user has occurred, please try again',
            'OK'
          );
        }
      },
      error: () => {
        this._userNotifyService.openNotification(
          'An error adding a user has occurred, please try again',
          'OK'
        );
      },
    });
  }

  public openEdit(event: User, inEdit: boolean): void {
    this._dialogue.open(UserDetailsModalComponent, {
      data: {
        user: event,
        editMode: inEdit,
        userNames: this.userService.userNames(),
      },
      height: '75%',
      width: '75%',
    });
  }
}
