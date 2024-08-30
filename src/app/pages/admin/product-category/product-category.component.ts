import { Category } from './../../../core/models/product-category.model';
import { Component, OnInit } from '@angular/core';

import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';
import { ProductCategoryService } from '../../../core/services/product-category/product-category.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryResponse, Select2Option } from '../../../core/models/product-category.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { catchError, map, Observable, throwError, of } from 'rxjs';
import { Select2Module  } from 'ng-select2-component';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    TableModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    Select2Module
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent implements OnInit{
  breadcrumbTitle: string = "Quản Lý Danh Mục Loại Sản Phẩm Mới";
  categoryForm:FormGroup;
  categoryList: Select2Option[] = [];
  product$: Observable<any>| undefined;
  searchValue: string = '';
  filteredCategories: any[] = [];
  sidebarVisible:boolean = false;
  hierarchicalCategories: any[] = [];

  constructor(
    private productCateSrv: ProductCategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.categoryForm = this.fb.group({
      CategoryId: [0],
      CategoryName: ['',Validators.required ],
      ParentCategoryId: [0],
      UserId: [0],

    });
  }

  ngOnInit() {
    this.loadCategory();
    this.getCategorySelect();
  }

  categories!: any[];

  loadCategory() {
    this.productCateSrv.getCategory().pipe(
      map((response: CategoryResponse) => {
        if (response.result && Array.isArray(response.data)) {
          this.categories = response.data;
          this.filteredCategories = this.categories; // Khởi tạo filteredCategories
          return response.data;
        } else {
          console.error('Unexpected data structure:', response);
          this.categories = [];
          this.filteredCategories = [];
          return [];
        }
      }),
      catchError((err: any) => {
        console.error('Error fetching categories:', err);
        this.categories = [];
        this.filteredCategories = [];
        return throwError(() => err);
      })
    ).subscribe();
  }

  searchCategories() {
    if (!this.searchValue) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.categoryName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        (category.categoryDescription && category.categoryDescription.toLowerCase().includes(this.searchValue.toLowerCase()))
      );
    }
  }

  openSidebar(){
    this.sidebarVisible = true;
    this.getCategorySelect()
    this.categoryForm.reset({
      CategoryId: 0,
      CategoryName: '',
      ParentCategoryId: 0,  // Đặt giá trị mặc định là 0 (Root)
      UserId: 0
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      // Gán giá trị mặc định cho UserId nếu không có giá trị khác
      categoryData.UserId = categoryData.UserId || 1;

      this.productCateSrv.createCategory(categoryData).subscribe({
        next: (response: any) => {
          if (response.result) {
            this.toastr.success('Tạo thể loại thành công');
            this.loadCategory();
            this.sidebarVisible = false;
          } else {
            this.toastr.error(response.message || 'Có lỗi xảy ra khi tạo danh mục');
          }
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.toastr.error('Có lỗi xảy ra khi tạo danh mục');
        }
      });
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin');
    }
  }


  getCategorySelect() {
    this.productCateSrv.getHierarchicalCategories().subscribe({
      next: (hierarchicalCategories) => {
        this.categoryList = [
          { value: 0, label: 'Root' },
          ...hierarchicalCategories
        ];
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
        this.categoryList = [{ value: 0, label: 'Root' }];
      }
    });
  }

  onDelete(categoryId: number){}

  // onDelete(categoryId: number) {
  //   // Kiểm tra xem danh mục có danh mục con không
  //   if (this.productCateSrv.hasChildCategories(this.categories, categoryId)) {
  //     this.toastr.error('Không thể xóa danh mục cha có danh mục con');
  //     return;
  //   }
  //   if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
  //     this.productCateSrv.deleteCategory(categoryId).subscribe({
  //       next: (response: CategoryResponse) => {
  //         if (response.result) {
  //           this.toastr.success('Đã xóa danh mục thành công');
  //           this.loadCategory();
  //         } else {
  //           this.toastr.error('Không thể xóa danh mục: ' + response.message);
  //         }
  //       },
  //       error: (error) => {
  //         this.toastr.error('Lỗi khi xóa danh mục');
  //         console.error('Lỗi khi xóa danh mục:', error);
  //       }
  //     });
  //   }
  // }





}
