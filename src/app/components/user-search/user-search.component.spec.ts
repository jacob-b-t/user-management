import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserSearchComponent } from './user-search.component';
import { UserService } from '../../services';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { User } from '../../models';

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    { username: 'alice', role: 'admin', enabled: true },
    { username: 'bob', role: 'user', enabled: false },
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['queryUsersByRoleOrName']);
    mockUserService.queryUsersByRoleOrName.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [UserSearchComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call user service when input changes', fakeAsync(() => {
    component.userSearch.setValue('a');
    tick();
    fixture.detectChanges();

    expect(mockUserService.queryUsersByRoleOrName).toHaveBeenCalledWith('a');
  }));

  it('should emit user when userSelected is called', () => {
    spyOn(component.userEmit, 'emit');
    const selectedUser = mockUsers[0];

    component.userSelected(selectedUser);

    expect(component.userEmit.emit).toHaveBeenCalledWith(selectedUser);
  });
});