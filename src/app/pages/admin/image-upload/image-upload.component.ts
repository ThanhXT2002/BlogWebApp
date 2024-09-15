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
  `
})
export class ImageUploadComponent {
  @Input() imageUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  placeholderImage: string = 'assets/default.png'; // Thay bằng đường dẫn đến ảnh mặc định của bạn

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

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
          this.imageUrlChange.emit(url);
        });
      })
    ).subscribe();
  }
}
