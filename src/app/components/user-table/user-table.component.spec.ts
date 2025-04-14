import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTableComponent } from './user-table.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleFormatterPipe } from '../../pipes/role-formatter.pipe';
import { User } from '../../models/user.interface';
import { of } from 'rxjs';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let mockAnnouncer: jasmine.SpyObj<LiveAnnouncer>;

  const mockUsers: User[] = [
    { username: 'alice', role: 'admin', enabled: true },
    { username: 'bob', role: 'user', enabled: false },
  ];

  beforeEach(async () => {
    mockAnnouncer = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    await TestBed.configureTestingModule({
      imports: [
        UserTableComponent,
        NoopAnimationsModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LiveAnnouncer, useValue: mockAnnouncer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update dataSource when users input changes', () => {
    component.users = mockUsers;
    component.ngOnChanges();

    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].username).toBe('alice');``
  });

  it('should announce sorting direction', () => {
    component.announceSortChange({ active: 'username', direction: 'asc' });
    expect(mockAnnouncer.announce).toHaveBeenCalledWith('Sorted ascending')

    component.announceSortChange({ active: 'username', direction: '' });
    expect(mockAnnouncer.announce).toHaveBeenCalledWith('Sorting cleared');
  });

  it('should emit edit event when editUser is called', () => {
    spyOn(component.edit, 'emit');
    const user = mockUsers[0];

    component.editUser(user);

    expect(component.edit.emit).toHaveBeenCalledWith(user);
  });
});