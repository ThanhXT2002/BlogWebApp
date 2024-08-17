import { Component } from '@angular/core';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, from, Observable } from 'rxjs';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [ FileUploadModule,],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {
  // constructor(private messageService: MessageService) {}

  constructor(private fireStorage: AngularFireStorage){}
  //chỉ uplaod được ảnh
  async onUpload($event: FileUploadEvent) {
    const file = $event.files[0];
    if(file){
      const path = `file/${file.name}`;
      const uploadFile = await this.fireStorage.upload(path, file);
      console.log(uploadFile);
    }
  }


  // upload multi
  async onUploadMulti($event: FileUploadEvent) {
    const promises:any[] = [];
    $event.files.forEach(file => promises.push(this.fireStorage.upload(`multiple/${file.name}`, file)));
    const observable = forkJoin([promises]);
    observable.subscribe({
      next: value =>console.log(value),
      complete: ()=> console.log('all done')
    })
  }

  // upload multicategory
  async onUploadMultiCategory($event: FileUploadEvent) {
    const promises:any[] = [];
    $event.files.forEach(file => promises.push(this.fireStorage.upload(`multipleCategory/${file.name}`, file)));
    const observable = forkJoin([promises]);
    observable.subscribe({
      next: value =>console.log(value),
      complete: ()=> console.log('all done')
    })
  }


  createFolder(folderPath: string): Observable<any> {
    // Tạo một file rỗng để đại diện cho thư mục
    const emptyFile = new File([""], ".folder", { type: "text/plain" });

    // Upload file rỗng vào đường dẫn của thư mục
    return from(this.fireStorage.upload(`${folderPath}/.folder`, emptyFile));
  }

  // Hàm để tạo thư mục con trong multipleCateGory
  createSubfolderInMultiCategory(subfolderName: string): Observable<any> {
    const folderPath = `multipleCateGory/${subfolderName}`;
    return this.createFolder(folderPath);
  }

  // Sử dụng hàm tạo thư mục
  onCreateSubfolder() {
    const subfolderName = 'newSubfolder'; // Tên thư mục con mới
    this.createSubfolderInMultiCategory(subfolderName).subscribe({
      next: (snapshot) => console.log('Subfolder created successfully', snapshot),
      error: (error) => console.error('Error creating subfolder', error),
      complete: () => console.log('Subfolder creation completed')
    });
  }

  // Hàm upload file vào thư mục con cụ thể
  uploadFileToSubfolder(subfolderName: string, file: File): Observable<any> {
    const filePath = `multipleCateGory/${subfolderName}/${file.name}`;
    return from(this.fireStorage.upload(filePath, file));
  }


  // Sử dụng hàm upload file vào thư mục con
  onUploadToSubfolder($event: { files: File[] }) {
    const subfolderName = 'yourSubfolderName'; // Thay thế bằng tên thư mục con thực tế
    const promises: Observable<any>[] = [];

    $event.files.forEach(file => {
      promises.push(this.uploadFileToSubfolder(subfolderName, file));
    });

    forkJoin(promises).subscribe({
      next: (values) => console.log('Files uploaded successfully', values),
      error: (error) => console.error('Error uploading files', error),
      complete: () => console.log('All uploads completed')
    });
  }


}
