import { TestBed } from '@angular/core/testing';

import { FirestoreUtilService } from './firestore-util.service';

describe('FirestoreUtilService', () => {
  let service: FirestoreUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
