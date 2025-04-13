import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services';
import type { User } from '../../models';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss',
})
export class UserSearchComponent implements OnInit {
  @Output() userEmit: EventEmitter<User> = new EventEmitter()
  private _userService: UserService = inject(UserService);

  public userSearch: FormControl = new FormControl('');
  public filteredOptions: Observable<User[]>;

  ngOnInit(): void {
    this.filteredOptions = this.userSearch.valueChanges.pipe(
      switchMap((value: string) => {
        return this._userService.queryUsersByRoleOrName(value)
      })
    )
  }

  public userSelected(event: User): void {
    this.userEmit.emit(event)
  }
}
