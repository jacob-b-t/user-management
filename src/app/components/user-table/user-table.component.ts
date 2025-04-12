import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleFormatterPipe } from '../../pipes/role-formatter.pipe';
import type { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    RoleFormatterPipe,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnChanges, AfterViewInit {
  @Input() users: User[];
  @Output() edit: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild(MatSort) sort: MatSort;

  private _liveAnnouncer = inject(LiveAnnouncer);
  public columns: string[] = ['username', 'role', 'enabled', 'edit'];
  public dataSource: MatTableDataSource<User>;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // Users are loaded asynchronously so this is required to ensure new values are displayed and sortable when the db changes
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editUser(event: User): void {
    this.edit.emit(event);
  }
}
