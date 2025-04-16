import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserFormComponent } from './user-form.component';
import { User, UserFormContent } from '../../models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let content: UserFormContent;

  beforeEach(async () => {
    content = {
      userNames: ['user1', 'user2'],
      editMode: false
    };

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    component.content = content;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct button text in add mode', () => {
    expect(component.buttonText).toBe('Add user');
  });

  it('should display correct button text in edit mode', () => {
    component.content.editMode = true;
    component.content.user = {
      username: 'admin1',
      enabled: true,
      role: 'admin',
      id: 'abc'
    };
    component.ngOnInit();
    expect(component.buttonText).toBe('Update user');
  });

  it('should mark username as taken if it exists in the userNames list', () => {
    const control = component.userForm.get('username');
    control?.setValue('user1');
    expect(control?.errors).toEqual({ userNameTaken: true });
  });

  it('should allow username if it matches the current user (edit mode)', () => {
    component.content.editMode = true;
    component.content.user = {
      username: 'user1',
      enabled: true,
      role: 'user',
      id: 'id123'
    };
    component.ngOnInit();
    const control = component.userForm.get('username');
    control?.setValue('user1');
    expect(control?.errors).toBeNull();
  });

  it('should emit userUpdated with correct values and reset form in add mode', () => {
    spyOn(component.userUpdated, 'emit');
    component.userForm.setValue({
      username: 'newuser',
      role: 'viewer',
      enabled: 'false'
    });

    component.updateUser();

    expect(component.userUpdated.emit).toHaveBeenCalledWith({
      username: 'newuser',
      role: 'viewer',
      enabled: false
    });
    expect(component.userForm.value.username).toBeNull();
  });

  it('should emit userUpdated and not reset form in edit mode', () => {
    component.content.editMode = true;
    component.ngOnInit();
    spyOn(component.userUpdated, 'emit');

    component.userForm.setValue({
      username: 'newuser',
      role: 'editor',
      enabled: 'true'
    });

    component.updateUser();

    expect(component.userUpdated.emit).toHaveBeenCalledWith({
      username: 'newuser',
      role: 'editor',
      enabled: true
    });
    expect(component.userForm.value.username).toBe('newuser');
  });

  it('should emit editCanceled when cancelEdit is called', () =>{
    spyOn(component.editCanceled, 'emit');
    component.cancelEdit();

    expect(component.editCanceled.emit).toHaveBeenCalledOnceWith(false)
  })

  it('should do nothing if deleteUser is called with no user data', () => {
    spyOn(component.userDeleted, 'emit');
    component.content.user = undefined;
    fixture.detectChanges();
    component.deleteUser();

    expect(component.userDeleted.emit).not.toHaveBeenCalled();
  })

  it('should emit a user.id if deleteUser is called and user data is present', () => {
    const mockUser: User = {
      username: 'user123',
      role: 'admin',
      id: '12345',
      enabled: true
    }
    spyOn(component.userDeleted, 'emit');
    component.content.user = mockUser;
    fixture.detectChanges();
    component.deleteUser();

    expect(component.userDeleted.emit).toHaveBeenCalledWith(mockUser.id);
  })
});
