import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsModalComponent } from './user-details-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleFormatterPipe } from '../../pipes/role-formatter.pipe';
import { UserService } from '../../services/user.service';
import { UserNotifyService } from '../../services';
import { User, UserFormOutput, UserModalContent } from '../../models';
import { of, throwError } from 'rxjs';

describe('UserDetailsModalComponent', () => {
  let component: UserDetailsModalComponent;
  let fixture: ComponentFixture<UserDetailsModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let notifyServiceSpy: jasmine.SpyObj<UserNotifyService>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<UserDetailsModalComponent>>;
  let userData: User;
  let content: UserModalContent;

  beforeEach(async () => {
    userData = {
      username: 'test123',
      enabled: true,
      id: '123456',
      role: 'admin',
    };
    content = {
      editMode: false,
      userNames: ['user1', 'user2'],
      user: userData,
    };

    userServiceSpy = jasmine.createSpyObj('UserService', [
      'updateUser',
      'deleteUser',
    ]);
    notifyServiceSpy = jasmine.createSpyObj('UserNotifyService', [
      'openNotification',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [UserDetailsModalComponent],
      providers: [
        RoleFormatterPipe,
        { provide: MAT_DIALOG_DATA, useValue: content },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserNotifyService, useValue: notifyServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateUser and handle success', () => {
    const formOutput: UserFormOutput = {
      username: 'updatedUser',
      enabled: false,
      role: 'user',
    };
    userServiceSpy.updateUser.and.returnValue(of(void 0));

    component.updateUser(formOutput);

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith({
      ...userData,
      ...formOutput,
    });
    expect(notifyServiceSpy.openNotification).toHaveBeenCalledWith(
      'User: updatedUser has been updated in the database',
      'OK'
    );
    expect(component.data.editMode).toBeFalse();
  });

  it('should call updateUser and handle error', () => {
    const formOutput: UserFormOutput = {
      username: 'failUser',
      enabled: true,
      role: 'user',
    };
    userServiceSpy.updateUser.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.updateUser(formOutput);

    expect(userServiceSpy.updateUser).toHaveBeenCalled();
    expect(notifyServiceSpy.openNotification).toHaveBeenCalledWith(
      'An error updating a user has occurred, please try again',
      'OK'
    );
  });

  it('should call deleteUser and handle success', () => {
    const deleteMessage = 'user has been deleted';
    userServiceSpy.deleteUser.and.returnValue(of(deleteMessage));

    component.deleteUser('user123');
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('user123');
    expect(notifyServiceSpy.openNotification).toHaveBeenCalledWith(
      deleteMessage,
      'OK'
    );
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('should call deleteUser and handle success', () => {
    userServiceSpy.deleteUser.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    component.deleteUser('user123');
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('user123');
    expect(notifyServiceSpy.openNotification).toHaveBeenCalledWith(
      'An error deleting the user has occurred, please try again',
      'OK'
    );
    expect(dialogSpy.close).not.toHaveBeenCalled();
  });

  it('should toggle editMode', () => {
    expect(component.data.editMode).toBeFalse();
    component.editUser(true);
    expect(component.data.editMode).toBeTrue();
    component.editUser(false);
    expect(component.data.editMode).toBeFalse();
  });
});
