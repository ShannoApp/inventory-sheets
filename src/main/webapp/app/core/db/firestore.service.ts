import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private itemsCollection: AngularFirestoreCollection<any> | null = null;

  constructor(private firestore: AngularFirestore) {
  }

  getItems(): Observable<any[]> | undefined {
    return this.itemsCollection?.valueChanges({ idField: 'id' });
  }

  addItem(item: any): Promise<DocumentReference<any>> | undefined {
    return this.itemsCollection?.add(item);
  }

  updateItem(id: string, data: any): Promise<void> | undefined {
    return this.itemsCollection?.doc(id).update(data);
  }

  deleteItem(id: string): Promise<void> | undefined {
    return this.itemsCollection?.doc(id).delete();
  }

  setCollectionName(collectionName: string): void {
    this.itemsCollection = this.firestore.collection<any>(collectionName);
  }

   // Create a subcollection inside a document
   addSubcollection(documentId: string, subcollectionName: string, data: any): Promise<DocumentReference<any>> | undefined{
    const documentRef = this.itemsCollection?.doc(documentId).collection(subcollectionName);
    return documentRef?.add(data);
  }

  // Get a subcollection inside a document
  getSubcollection(documentId: string, subcollectionName: string): Observable<any[]> | undefined {
    const documentRef = this.itemsCollection?.doc(documentId).collection(subcollectionName);
    return documentRef?.valueChanges({ idField: 'id' });
  }
}
