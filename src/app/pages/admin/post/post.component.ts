import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PostService } from '../../../core/services/post/post.service';
import { ToastrService } from 'ngx-toastr';
import { IPost } from '../../../core/models/post.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit  {
  breadcrumbTitle: string = 'Quản Lý Danh Mục Bài Viết';
  searchValue: string = '';
  posts: IPost[] = [];
  originalPosts: any[] = [];
  constructor(
    private router: Router,
    private postService: PostService,
    private toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getAllPost()
  }

  getAllPost() {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.originalPosts = posts;  // Lưu danh sách gốc
        this.posts = posts;  // Hiển thị ban đầu
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      }
    });
  }

  searchPosts() {
    const searchTerm = this.searchValue?.toLowerCase().trim();

    if (!searchTerm) {
      // Nếu searchValue trống, hiển thị tất cả bài viết
      this.posts = [...this.originalPosts];
      return;
    }

    // Lọc bài viết theo từ khóa tìm kiếm
    this.posts = this.originalPosts.filter(post =>
      (post.title?.toLowerCase() ?? '').includes(searchTerm)
    );
  }

  editPost(key: string) {
    this.router.navigate(['/admin/form-post/', key]);
  }

  remove(key:string){
    if(window.confirm("Bạn có thực sự muốn xóa bản ghi này không?")){
      this.postService.delete(key).subscribe({
        next: () => {
          console.log('Xóa thành công');
          this.toastr.success("Xóa thành công!")
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          this.toastr.error("Xóa không thành công!")
        }
      });
    }
  }


}
