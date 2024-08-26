import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { IPostCategory } from '../../../core/models/post-category.model';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';
import { PostCategoryService } from '../../../core/services/post-category/post-category.service';

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    InputTextModule
  ],
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.scss'
})
export class PostCategoryComponent implements OnInit {
  breadcrumbTitle: string = 'Quản Lý Danh Mục Loại Bài Viết';
  postCategories: IPostCategory[] = [];
  filteredPostCategories: IPostCategory[] = [];
  searchValue: string = '';
  constructor(
    private router: Router,
    private postCategoryService: PostCategoryService,
    private toastr: ToastrService,
  ){}
  ngOnInit(): void {
    this.getAllPostCategory()
  }

  getAllPostCategory() {
    this.postCategoryService.getAllPostCategories().subscribe({
      next: (categories) => {
        this.postCategories = categories;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    });
  }

  searchPostCategories() {
    if (!this.searchValue.trim()) {
      // Nếu searchValue trống, hiển thị tất cả danh mục
      this.getAllPostCategory();
      return;
    }
    const searchTerm = this.searchValue.toLowerCase().trim();
    this.postCategories = this.postCategories.filter(category =>
      (category.title?.toLowerCase() ?? '').includes(searchTerm)
    );
  }

  editCategory(key: string) {
    this.router.navigate(['/admin/form-post-category/', key]);
  }

  deleteCategory(key:string){
    if(window.confirm("Bạn có thực sự muốn xóa bản ghi này không?")){
      this.postCategoryService.deleteCategory(key).subscribe({
        next: (result) => {
          if (result) {
            this.toastr.success('Danh mục đã được xóa thành công!','Thành công!');
          } else {
            this.toastr.error('Không thể xóa danh mục vì nó có danh mục con!','Lỗi!');
          }
        },
        error: (error) => {
          console.error('Có lỗi xảy ra khi xóa danh mục:', error);
          this.toastr.error('Có lỗi xảy ra khi xóa danh mục!','Lỗi!');
        }
      });
    }
  }
}
