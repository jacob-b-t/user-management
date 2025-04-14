import { TestBed } from '@angular/core/testing';
import { UserNotifyService } from './user-notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UserNotifyService', () => {
  let service: UserNotifyService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        UserNotifyService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(UserNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call MatSnackBar.open with the correct message and action', () => {
    const message = 'Hello!';
    const action = 'OK';

    service.openNotification(message, action);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, action);
  });
});