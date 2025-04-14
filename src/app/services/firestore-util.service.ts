import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  updateDoc,
  doc,
  docData,
  Timestamp,
  query,
  where,
  or,
  and
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreUtilService {
  public collection = collection;
  public collectionData = collectionData;
  public addDoc = addDoc;
  public updateDoc = updateDoc;
  public doc = doc;
  public docData = docData;
  public query = query;
  public where = where;
  public or = or;
  public and = and;
  public Timestamp = Timestamp;
}