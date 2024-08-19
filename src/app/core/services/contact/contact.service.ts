import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private dbPath = '/contacts';

  constructor(private db: AngularFireDatabase) {}

  createContact(contact: Contact): Promise<void> {
    return this.db.list(this.dbPath).push({
      ...contact,
      timestamp: Date.now()
    }).then(() => console.log('Contact created successfully'))
      .catch(error => console.error('Error creating contact:', error));
  }

  getContacts(): Observable<Contact[]> {
    return this.db.list<Contact>(this.dbPath).valueChanges();
  }
}
