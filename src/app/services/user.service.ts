import { inject, Injectable, signal } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
} from '@angular/fire/firestore';
import { FirestoreUtilService } from './firestore-util.service';
import { delay, first, from, map, Observable, of, switchMap, tap } from 'rxjs';
import type { User, UserFormOutput } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _firestore: Firestore = inject(Firestore);
  private _firestoreUtil: FirestoreUtilService = inject(FirestoreUtilService);
  private _httpClient: HttpClient = inject(HttpClient);
  private _userCollection = this._firestoreUtil.collection(
    this._firestore,
    'users'
  );

  public userNames = signal<string[]>([]);

  public getUsers(): Observable<User[]> {
    return this._firestoreUtil
      .collectionData(this._userCollection, { idField: 'id' })
      .pipe(
        // Set the userNames to be used in username duplication control
        tap((response: (DocumentData | (DocumentData & User))[]) =>
          this.userNames.set(response.map((value) => value.username))
        ),
        map((response: (DocumentData | (DocumentData & User))[]) =>
          response.map((value) => {
            return {
              username: value.username,
              enabled: value.enabled,
              id: value.id,
              role: value.role,
            };
          })
        )
      );
  }

  public getUserById(id: string): Observable<User | null> {
    return this._firestoreUtil
      .docData(this._firestoreUtil.doc(this._firestore, 'users', id), {
        idField: 'id',
      })
      .pipe(
        first(),
        map((value: DocumentData | (DocumentData & User) | undefined) => {
          if (!value) {
            return null;
          }
          return {
            username: value.username,
            enabled: value.enabled,
            id: value.id,
            role: value.role,
          };
        })
      );
  }

  public addUser(newUser: UserFormOutput): Observable<User | null> {
    const fullUser: User = {
      ...newUser,
      createdAt: this._firestoreUtil.Timestamp.fromDate(new Date()),
    };
    return from(
      this._firestoreUtil.addDoc(this._userCollection, fullUser)
    ).pipe(
      first(),
      switchMap((documentReference: DocumentReference) => {
        return this.getUserById(documentReference.id);
      })
    );
  }

  public updateUser(user: User): Observable<string | void> {
    if (!user?.id) {
      return of('User id is required');
    }
    // Stop the document id being added a field value needlessly
    const noDuplicateId = structuredClone(user);
    delete noDuplicateId.id;
    const ref = this._firestoreUtil.doc(this._firestore, 'users', user.id);
    return from(this._firestoreUtil.updateDoc(ref, { ...noDuplicateId })).pipe(
      first()
    );
  }

  /**
   * Limitation with this - Firestore does not support searching substrings so this will only search the start of the fields username and role
   */
  public queryUsersByRoleOrName(queryString: string): Observable<User[]> {
    const searchQuery = this._firestoreUtil.query(
      this._userCollection,
      this._firestoreUtil.or(
        this._firestoreUtil.and(
          this._firestoreUtil.where('username', '>=', queryString),
          this._firestoreUtil.where('username', '<=', queryString + '\uf8ff')
        ),
        // Uppercase:
        this._firestoreUtil.and(
          this._firestoreUtil.where(
            'username',
            '>=',
            queryString.charAt(0).toUpperCase() + queryString.slice(1)
          ),
          this._firestoreUtil.where(
            'username',
            '<=',
            queryString.charAt(0).toUpperCase() +
              queryString.slice(1) +
              '\uf8ff'
          )
        ),
        // lowercase:
        this._firestoreUtil.and(
          this._firestoreUtil.where(
            'username',
            '>=',
            queryString.toLowerCase()
          ),
          this._firestoreUtil.where(
            'username',
            '<=',
            queryString.toLowerCase() + '\uf8ff'
          )
        ),
        this._firestoreUtil.and(
          this._firestoreUtil.where('role', '>=', queryString),
          this._firestoreUtil.where('role', '<=', queryString + '\uf8ff')
        ),
        // Uppercase:
        this._firestoreUtil.and(
          this._firestoreUtil.where(
            'role',
            '>=',
            queryString.charAt(0).toUpperCase() + queryString.slice(1)
          ),
          this._firestoreUtil.where(
            'role',
            '<=',
            queryString.charAt(0).toUpperCase() +
              queryString.slice(1) +
              '\uf8ff'
          )
        ),
        // lowercase:
        this._firestoreUtil.and(
          this._firestoreUtil.where('role', '>=', queryString.toLowerCase()),
          this._firestoreUtil.where(
            'role',
            '<=',
            queryString.toLowerCase() + '\uf8ff'
          )
        )
      )
    );
    return this._firestoreUtil.collectionData(searchQuery).pipe(
      map((response: (DocumentData | (DocumentData & User))[]) =>
        response.map((value) => {
          return {
            username: value.username,
            enabled: value.enabled,
            id: value.id,
            role: value.role,
          };
        })
      )
    );
  }

  public deleteUser(
    userId: string,
    withCloudFunction: boolean = false
  ): Observable<string> {
    if (withCloudFunction) {
      return this._httpClient.delete<string>(`url-to-cloud-function/${userId}`);
    }
    return of('user has been deleted').pipe(delay(1000));
  }
}
