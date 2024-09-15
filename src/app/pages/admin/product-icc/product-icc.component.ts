import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { IProductIcc } from '../../../core/models/product-icc.models';
import { ProductIccService } from '../../../core/services/productIcc/product-icc.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-product-icc',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    InputSwitchModule
  ],
  templateUrl: './product-icc.component.html',
  styleUrl: './product-icc.component.scss'
})
export class ProductIccComponent {
  breadcrumbTitle: string = 'Quản Lý Danh Mục Bài Viết';
  searchValue: string = '';
  products: IProductIcc[] = [];
  originalProducts: any[] = [];
  constructor(
    private router: Router,
    private productService: ProductIccService,
    private toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.originalProducts = products;  // Lưu danh sách gốc
        this.products = products;  // Hiển thị ban đầu
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      }
    });
  }

  searchChange() {
    const searchTerm = this.searchValue?.toLowerCase().trim();

    if (!searchTerm) {
      // Nếu searchValue trống, hiển thị tất cả bài viết
      this.products = [...this.originalProducts];
      return;
    }

    // Lọc bài viết theo từ khóa tìm kiếm
    this.products = this.originalProducts.filter(product =>
      (product.title?.toLowerCase() ?? '').includes(searchTerm)
    );
  }

  editProduct(key: string) {
    this.router.navigate(['/admin/form-product-icc', key], { queryParams: { mode: 'edit' } });
  }

  remove(key:string){
    if(window.confirm("Bạn có thực sự muốn xóa bản ghi này không?")){
      this.productService.delete(key).subscribe({
        next: () => {
          this.toastr.success("Xóa thành công!");
          this.getAllProducts();
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          this.toastr.error("Xóa không thành công!")
        }
      });
    }
  }

  togglePublish(product: IProductIcc) {
    const updatedPublishState = !product.publish;
    this.productService.update(product.key!, { publish: updatedPublishState }).subscribe({
      next: () => {
        this.toastr.success('Product publish status updated');
        product.publish = updatedPublishState;
      },
      error: (error) => {
        this.toastr.error('Error updating product publish status');
        console.error(error);
      }
    });
  }

}
