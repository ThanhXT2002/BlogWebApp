import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactService } from '../../../core/services/contact/contact.service';
import { Contact } from '../../../core/models/contact.model';
import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputSwitchModule
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  breadcrumbTitle: string = 'Quản Lý Danh Sách Liên Hệ';
  contacts$: Observable<Contact[]>;
  originalContacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchValue: string = '';

  constructor(private contactService: ContactService) {
    this.contacts$ = this.contactService.getContacts();
  }

  ngOnInit(): void {
    this.contacts$.subscribe((contacts) => {
      this.originalContacts = contacts;
      this.filteredContacts = [...this.originalContacts];
    });
  }

  searchContacts(): void {
    const searchTerm = this.searchValue?.toLowerCase().trim();

    if (!searchTerm) {
      // Nếu searchValue trống, hiển thị tất cả contacts
      this.filteredContacts = [...this.originalContacts];
      return;
    }

    // Lọc contacts theo từ khóa tìm kiếm
    this.filteredContacts = this.originalContacts.filter(contact =>
      (contact.name?.toLowerCase() ?? '').includes(searchTerm) ||
      (contact.email?.toLowerCase() ?? '').includes(searchTerm) ||
      (contact.message?.toLowerCase() ?? '').includes(searchTerm)
    );
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}

