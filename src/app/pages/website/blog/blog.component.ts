import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../../core/services/authentication/auth.service';
import { Component, signal, Pipe, OnInit } from '@angular/core';
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
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit{
  allPosts: IPost[] = [];
  displayedPosts: IPost[] = [];
  postsPerPage = 3;
  currentPage = 1;
  showLoadMore = true;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        // Sắp xếp posts theo created_at mới nhất
        this.allPosts = posts.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.updateDisplayedPosts();
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      }
    });
  }

  updateDisplayedPosts() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.postsPerPage;
    this.displayedPosts = this.allPosts.slice(startIndex, endIndex);
    this.showLoadMore = endIndex < this.allPosts.length;
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayedPosts();
  }

}
