import { inject, Injectable, signal } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  updateDoc,
  collection,
  collectionData,
  doc,
  docData,
  Timestamp,
  query,
  where,
  or,
  and,
} from '@angular/fire/firestore';
import { first, from, map, Observable, of, switchMap, tap } from 'rxjs';
import type { User, UserFormOutput } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _firestore: Firestore = inject(Firestore);
  private _userCollection = collection(this._firestore, 'users');

  public userNames = signal<string[]>([]);

  public getUsers(): Observable<User[]> {
    return collectionData(this._userCollection, { idField: 'id' }).pipe(
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
    return docData(doc(this._firestore, 'users', id), { idField: 'id' }).pipe(
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
      createdAt: Timestamp.fromDate(new Date()),
    };
    return from(addDoc(this._userCollection, fullUser)).pipe(
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
    const ref = doc(this._firestore, 'users', user.id);
    return from(updateDoc(ref, { ...user })).pipe(first());
  }

  /**
   * Limitation with this - Firestore does not support searching substrings so this will only search the start of the fields username and role
   */
  public queryUsersByRoleOrName(queryString: string): Observable<User[]> {
    const searchQuery = query(
      this._userCollection,
      or(
        and(
          where('username', '>=', queryString),
          where('username', '<=', queryString + '\uf8ff')
        ),
        // Uppercase:
        and(
          where(
            'username',
            '>=',
            queryString.charAt(0).toUpperCase() + queryString.slice(1)
          ),
          where(
            'username',
            '<=',
            queryString.charAt(0).toUpperCase() +
              queryString.slice(1) +
              '\uf8ff'
          )
        ),
        // lowercase:
        and(
          where('username', '>=', queryString.toLowerCase()),
          where('username', '<=', queryString.toLowerCase() + '\uf8ff')
        ),
        and(
          where('role', '>=', queryString),
          where('role', '<=', queryString + '\uf8ff')
        ),
        // Uppercase:
        and(
          where(
            'role',
            '>=',
            queryString.charAt(0).toUpperCase() + queryString.slice(1)
          ),
          where(
            'role',
            '<=',
            queryString.charAt(0).toUpperCase() +
              queryString.slice(1) +
              '\uf8ff'
          )
        ),
        // lowercase:
        and(
          where('role', '>=', queryString.toLowerCase()),
          where('role', '<=', queryString.toLowerCase() + '\uf8ff')
        )
      )
    );
    return collectionData(searchQuery).pipe(
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
}
