import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../../core/services/authentication/auth.service';
import { Component, signal, Pipe } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SliderComponent } from "../slider/slider.component";
import { PostService } from '../../../core/services/post/post.service';
import { IPost } from '../../../core/models/post.model';
import { CommonModule, DatePipe } from '@angular/common';
import { SanitizeHtmlPipe } from '../../../core/pipe/sanitize-html.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent,
    RouterModule,
    DatePipe,
    CommonModule,
    SanitizeHtmlPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  mainPost: IPost | null = null;
  secondaryPosts: IPost[] = [];
  lastPost: IPost | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private postService : PostService
  ) { }

  ngOnInit() {
    this.getAllPosts()
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        const sortedPosts = posts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6); // Lấy 6 bài mới nhất

        if (sortedPosts.length > 0) {
          this.mainPost = sortedPosts[0];
        }
        if (sortedPosts.length > 1) {
          this.secondaryPosts = sortedPosts.slice(1, 5);
        }
        if (sortedPosts.length === 6) {
          this.lastPost = sortedPosts[5];
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      }
    });
  }




}
