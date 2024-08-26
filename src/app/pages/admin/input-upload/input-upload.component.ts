import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-input-upload',
  standalone: true,
  imports: [],
  template: `
    <input
      type="text"
      [value]="imageUrl"
      readonly
      (click)="fileInput.click()"
      class="form-control"
    />
    <input
      type="file"
      #fileInput
      (change)="onFileSelected($event)"
      style="display: none"
      accept="image/*"
    />
  `,
  styleUrl: './input-upload.component.scss'
})
export class InputUploadComponent {
  @Input() imageUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();

  constructor(private storage: AngularFireStorage) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `system/${new Date().getTime()}_${file.name}`;
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
}
