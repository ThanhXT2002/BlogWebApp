import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative w-full h-full cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      (click)="fileInput.click()"
    >
      <img
        [src]="imageUrl || placeholderImage"
        alt="Upload image"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span class="text-white text-sm font-medium">Click to upload image</span>
      </div>
    </div>
    <input
      #fileInput
      type="file"
      (change)="onFileSelected($event)"
      class="hidden"
      accept="image/*"
    />
    <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
      <div class="bg-blue-200 rounded-full h-2.5 dark:bg-blue-700 w-full">
        <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="uploadProgress"></div>
      </div>
      <p class="text-sm text-gray-600 mt-1">Uploading: {{ uploadProgress }}%</p>
    </div>
  `
})
export class ImageUploadComponent {
  @Input() imageUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  placeholderImage: string = 'assets/default.png'; // Thay bằng đường dẫn đến ảnh mặc định của bạn
  uploadProgress: number = 0;

  constructor(private storage: AngularFireStorage) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    const filePath = `uploads/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Observe upload progress
    task.percentageChanges().subscribe(progress => {
      this.uploadProgress = Math.round(progress || 0);
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
          this.imageUrlChange.emit(url);
          this.uploadProgress = 0; // Reset progress after upload
        });
      })
    ).subscribe();
  }
}
