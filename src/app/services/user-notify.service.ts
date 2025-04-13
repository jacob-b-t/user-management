import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserNotifyService {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  public openNotification(message: string, action: string) {
    this._snackBar.open(message, action)
  }
}
