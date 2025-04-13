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
} from '@angular/fire/firestore';
import { first, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { User, UserFormOutput } from '../models/user.interface';

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

  public getUserById(id: string): Observable<any> {
    return docData(doc(this._firestore, 'users', id), { idField: 'id' }).pipe(
      first(),
      tap((val) => console.log(val))
    );
  }

  public addUser(newUser: UserFormOutput): Observable<any> {
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

  public updateUser(user: User): Observable<any> {
    if (!user?.id) {
      return of('User id is required');
    }
    const ref = doc(this._firestore, 'users', user.id);
    return from(updateDoc(ref, { ...user })).pipe(first());
  }
}
