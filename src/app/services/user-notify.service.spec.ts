import { TestBed } from '@angular/core/testing';

import { UserNotifyService } from './user-notify.service';

describe('UserNotifyService', () => {
  let service: UserNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
