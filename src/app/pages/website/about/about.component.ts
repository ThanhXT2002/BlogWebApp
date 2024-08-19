import { Component, OnInit } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  imageUrls: string[] = [];

  constructor( private fireStorage: AngularFireStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadImages();
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
        console.log('Images loaded:', urls);
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.toastr.error('Không thể tải ảnh!');
      }
    });
  }



}
