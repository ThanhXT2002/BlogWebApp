import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";

import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, from, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-image-about',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    FileUploadModule
],
  templateUrl: './image-about.component.html',
  styleUrl: './image-about.component.scss'
})
export class ImageAboutComponent implements OnInit{
  breadcrumbTitle: string = 'Quản Lý Ảnh Trang Giới Thiệu';
  imageUrls: string[] = [];
  constructor(
    private fireStorage: AngularFireStorage,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    // Load images when component initializes
    this.loadImages();
  }
    // upload multi
    async onUploadMulti($event: FileUploadEvent) {
      const promises: Promise<any>[] = [];
      $event.files.forEach(file => promises.push(this.fireStorage.upload(`aboutImage/${file.name}`, file).then()));

      forkJoin(promises).subscribe({
        next: () => {
          console.log('All files uploaded');
          this.toastr.success('Upload Thành Công!');
          // Reload images after successful upload
          this.loadImages();
        },
        error: (error) => {
          console.error('Error uploading files:', error);
          this.toastr.error('Upload thất bại!');
        }
      });
    }

    loadImages() {
      const storageRef = this.fireStorage.ref('aboutImage');
      storageRef.listAll().pipe(
        switchMap(result => {
          const urlObservables = result.items.map(item => item.getDownloadURL());
          return forkJoin(urlObservables);
        })
      ).subscribe({
        next: (urls) => {
          this.imageUrls = urls;
        },
        error: (error) => {
          console.error('Error loading images:', error);
          this.toastr.error('Không thể tải ảnh!');
        }
      });
    }

}
