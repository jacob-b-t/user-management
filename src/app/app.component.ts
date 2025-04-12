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
} from './components';
import type { User, UserFormOutput } from './models/user.interface';
import { UserService } from './services/user.service';

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
  public userService = inject(UserService);

  public title = 'user-management-fe';
  public users$: Observable<User[]> = this.userService.getUsers();
  public heroHeader: string = 'User Managment';

  public userAddedClicked(event: UserFormOutput): void {
    this.userService.addUser(event).subscribe({
      next: (res) => {
        console.log('in app', res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  public openEdit(event: User, inEdit: boolean): void {
    this._dialogue.open(UserDetailsModalComponent, {
      data: {
        ...event,
        ...{ editMode: inEdit, userNames: this.userService.userNames() },
      },
      height: '75%',
      width: '75%',
    });
  }
}
