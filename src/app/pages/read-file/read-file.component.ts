import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../core/services/storage/firebase-storage.service';
import { CommonModule } from '@angular/common';


interface StorageItem {
  name: string;
  fullPath: string;
  type: 'file' | 'folder';
  downloadURL?: string;
}

@Component({
  selector: 'app-read-file',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './read-file.component.html',
  styleUrl: './read-file.component.scss'
})
export class ReadFileComponent {
  // selectedFiles: File[] = [];
  // items: StorageItem[] = [];

  // constructor(private firebaseStorageService: FirebaseStorageService) {}

  // onFileSelected(event: any) {
  //   this.selectedFiles = Array.from(event.target.files);
  // }

  // ngOnInit() {
  //   this.getMultiCategoryItems();
  // }



  // uploadFiles() {
  //   if (this.selectedFiles.length > 0) {
  //     this.firebaseStorageService.uploadMultiCategory(this.selectedFiles).subscribe({
  //       next: (value) => console.log('Upload successful', value),
  //       error: (error) => console.error('Upload failed', error),
  //       complete: () => {
  //         console.log('Upload completed');
  //         this.getMultiCategoryItems();
  //       }
  //     });
  //   }
  // }

  // getMultiCategoryItems() {
  //   this.firebaseStorageService.getAllMultiCategoryItems().subscribe({
  //     next: (items) => {
  //       this.items = items;
  //       console.log('Items retrieved', items);
  //     },
  //     error: (error) => console.error('Error getting items', error)
  //   });
  // }

  // deleteFile(fileUrl: string) {
  //   this.firebaseStorageService.deleteFile(fileUrl).then(
  //     () => {
  //       console.log('File deleted successfully');
  //       this.getMultiCategoryItems(); // Refresh the file list
  //     },
  //     error => {
  //       console.error('Error deleting file', error);
  //     }
  //   );
  // }
}
