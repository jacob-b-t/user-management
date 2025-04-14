import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserService } from './user.service';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreUtilService } from './firestore-util.service';
import { of, Subscription } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let firestoreUtil: jasmine.SpyObj<FirestoreUtilService>;
  let subscriptions: Subscription[] = [];
  let firestoreUtilSpy: jasmine.SpyObj<FirestoreUtilService>

  const mockUser = {
    username: 'testuser',
    enabled: true,
    id: '123',
    role: 'admin',
  };

  beforeEach(() => {
    firestoreUtilSpy = jasmine.createSpyObj('FirestoreUtilService', [
      'collection',
      'collectionData',
      'addDoc',
      'doc',
      'docData',
      'updateDoc',
      'query',
      'where',
      'or',
      'and',
      'Timestamp',
    ]);

    firestoreUtilSpy.collection.and.returnValue({} as any);
    firestoreUtilSpy.collectionData.and.returnValue(of([mockUser]));
    firestoreUtilSpy.addDoc.and.returnValue(Promise.resolve({ id: 'mockId' } as any));
    firestoreUtilSpy.doc.and.returnValue({} as any);
    firestoreUtilSpy.docData.and.returnValue(of(mockUser));
    firestoreUtilSpy.updateDoc.and.returnValue(Promise.resolve());
    firestoreUtilSpy.Timestamp = {
      fromDate: jasmine.createSpy().and.returnValue({}),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: Firestore, useValue: {} },
        { provide: FirestoreUtilService, useValue: firestoreUtilSpy },
      ],
    });

    service = TestBed.inject(UserService);
    firestoreUtil = TestBed.inject(
      FirestoreUtilService
    ) as jasmine.SpyObj<FirestoreUtilService>;
  });

  afterEach(() => {
    // Ensure no subscriptions stay open and leak memory
    subscriptions.forEach((sub) => sub.unsubscribe());
    subscriptions = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of users from getUsers()', fakeAsync(() => {
    let users;
    subscriptions.push(
      service.getUsers().subscribe({
        next: (u) => {
          users = u;
          expect(users.length).toBe(1);
          expect(users[0].username).toBe('testuser');
        },
      })
    );
  }));

  it('should get a user by id', fakeAsync(() => {
    let user;
    subscriptions.push(
      service.getUserById('123').subscribe({
        next: (u) => {
          user = u;
          expect(user?.id).toBe('123');
        },
      })
    );
  }));

  it('should return null if no user is found', fakeAsync(() => {
    let user;
    firestoreUtilSpy.docData.and.returnValue(of(undefined))
    subscriptions.push(
      service.getUserById('123').subscribe({
        next: (u) => {
          user = u;
          expect(user).toBeNull();
        },
      })
    );
  }));

  it('should add a new user and fetch it back', fakeAsync(() => {
    let result;
    subscriptions.push(
      service
        .addUser({ username: 'testuser', enabled: true, role: 'admin' })
        .subscribe({
          next: (res) => {
            result = res;
            expect(result?.username).toBe('testuser');
          },
        })
    );
  }));

  it('should update a user', fakeAsync(() => {
    subscriptions.push(service.updateUser(mockUser).subscribe());
    tick();
    expect(firestoreUtil.updateDoc).toHaveBeenCalled();
  }));

  it('should return error message when updateUser is called without id', fakeAsync(() => {
    let result;
    subscriptions.push(
      service
        .updateUser({ username: 'fail', role: 'admin', enabled: true } as any)
        .subscribe({
          next: (res) => {
            result = res;
            expect(result).toBe('User id is required');
          },
        })
    );
  }));

  it('should query users by role or name', fakeAsync(() => {
    const queryString = 'admin';
    const mockQueryRef = {};
    const mockUsers = [
      { username: 'admin', role: 'admin', enabled: true, id: '1' },
      { username: 'AdminUser', role: 'user', enabled: true, id: '2' },
    ];

    // Setup return value chaining for query construction
    firestoreUtil.where.and.returnValue('where-clause' as any);
    firestoreUtil.and.and.returnValue('and-clause' as any);
    firestoreUtil.or.and.returnValue('or-clause' as any);
    firestoreUtil.query.and.returnValue(mockQueryRef as any);
    firestoreUtil.collectionData.and.returnValue(of(mockUsers));

    let result: any;
    subscriptions.push(
      service.queryUsersByRoleOrName(queryString).subscribe((res) => {
        result = res;
        expect(result.length).toBe(2);
        expect(result[0].username).toBe('admin');
      })
    );

    expect(firestoreUtil.where).toHaveBeenCalled();
    expect(firestoreUtil.and).toHaveBeenCalled();
    expect(firestoreUtil.or).toHaveBeenCalled();
    expect(firestoreUtil.query).toHaveBeenCalled();
    expect(firestoreUtil.collectionData).toHaveBeenCalled();
  }));
});
