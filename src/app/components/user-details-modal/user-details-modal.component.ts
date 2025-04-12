import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import type { UserModalContent } from '../../models/userModalContent.interface';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, UserFormComponent],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.scss',
})
export class UserDetailsModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UserModalContent) {}
}
