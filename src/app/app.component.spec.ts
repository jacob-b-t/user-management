import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { UserService, UserNotifyService } from './services';
import { User, UserFormOutput } from './models/user.interface';
import { UserDetailsModalComponent } from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let mockUserService: jasmine.SpyObj<UserService>;
  let mockUserNotifyService: jasmine.SpyObj<UserNotifyService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const testUser: User = {
    username: 'jane.doe',
    role: 'admin',
    enabled: true,
  };

  const formOutput: UserFormOutput = {
    username: 'jane.doe',
    role: 'admin',
    enabled: true,
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'addUser', 'userNames']);
    mockUserNotifyService = jasmine.createSpyObj('UserNotifyService', ['openNotification']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockUserService.getUsers.and.returnValue(of([]));
    mockUserService.addUser.and.returnValue(of(testUser));
    mockUserService.userNames.and.returnValue(['john', 'jane']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: UserNotifyService, useValue: mockUserNotifyService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.addUser and open notification on success', () => {
    component.userAddedClicked(formOutput);

    expect(mockUserService.addUser).toHaveBeenCalledWith(formOutput);
    expect(mockUserNotifyService.openNotification).toHaveBeenCalledWith(
      `New ${testUser.role}: ${testUser.username} has been added to the database`,
      'OK'
    );
  });

  it('should open error notification when addUser returns null', () => {
    mockUserService.addUser.and.returnValue(of(null));

    component.userAddedClicked(formOutput);

    expect(mockUserNotifyService.openNotification).toHaveBeenCalledWith(
      'An error adding a user has occurred, please try again',
      'OK'
    );
  });

  it('should open error notification on addUser error', () => {
    mockUserService.addUser.and.returnValue(throwError(() => new Error('add error')));

    component.userAddedClicked(formOutput);

    expect(mockUserNotifyService.openNotification).toHaveBeenCalledWith(
      'An error adding a user has occurred, please try again',
      'OK'
    );
  });

  it('should open the user details modal with correct data', () => {
    component.openEdit(testUser, true);

    expect(mockDialog.open).toHaveBeenCalledWith(UserDetailsModalComponent, jasmine.objectContaining({
      data: {
        user: testUser,
        editMode: true,
        userNames: ['john', 'jane'],
      },
      height: '75%',
      width: '75%',
    }));
  });
});