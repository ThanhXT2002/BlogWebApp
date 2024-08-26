import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';
import { ProductService } from '../../../core/services/product/product.service';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { VndCurrencyPipe } from '../../../core/pipe/vnd-currency/vnd-currency.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    TableModule,
    ConfirmDialogModule,
    ButtonModule,
    RouterModule,
    VndCurrencyPipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [ConfirmationService],
})
export class ProductComponent {
  breadcrumbTitle: string = 'Quản Lí Sản Phẩm';
  productsList: any[] = [];

  searchValue: string = '';
  filteredProductsList: any[] = [];

  constructor(
    private productSrv: ProductService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  // lấy  sản phẩm từ bên services

  getAllProducts() {
    this.productSrv.getProducts().subscribe({
      next: (res) => {
        if (res.data && Array.isArray(res.data)) {
          // Lọc ra các sản phẩm có SKU bắt đầu bằng "TXT"
          this.productsList = res.data
            .filter((product) => product.productSku.startsWith('TXT'))
            .sort((a, b) => {
              const dateA = new Date(a.createdDate).getTime();
              const dateB = new Date(b.createdDate).getTime();
              return dateB - dateA;
            });
            this.filteredProductsList = this.productsList;
        } else {
          this.productsList = [];
          console.error('Unexpected data structure:', res);
        }
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.productsList = [];
      },
    });
  }
  // getAllProducts() {
  //   this.productSrv.getProducts().subscribe({
  //     next: (res) => {
  //       if (res.data && Array.isArray(res.data)) {
  //         this.productsList = res.data.sort((a, b) => {
  //           const dateA = new Date(a.createdDate).getTime();
  //           const dateB = new Date(b.createdDate).getTime();
  //           return dateB - dateA;
  //         });
  //         this.filteredProductsList = this.productsList; // Khởi tạo filteredProductsList
  //       } else {
  //         this.productsList = [];
  //         this.filteredProductsList = [];
  //         console.error('Unexpected data structure:', res);
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching products:', error);
  //       this.productsList = [];
  //       this.filteredProductsList = [];
  //     }
  //   });
  // }

  edit(product: any) {
    this.router.navigate(['/admin/form-product', product.productId], {
      queryParams: { mode: 'edit' },
    });
  }

  remove(item: any, event: Event) {
    console.log(item.productId);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có thực sự muốn xóa sản phẩm này không?',
      header: 'Xóa!',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'btn btn-sm p-button-danger p-button-text',
      rejectButtonStyleClass: 'btn btn-sm p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.productSrv.deleteProduct(item.productId).subscribe((res: any) => {
          if (res.result) {
            this.getAllProducts();
            this.toastr.success('Xóa sẩn phẩm thành công!');
          } else if (res.error) {
            this.toastr.error('Xóa sẩn phẩm thất bại!');
          } else {
            console.log(res.message);
          }
        });
      },
      reject: () => {},
    });
  }

  onDelete(item: any) {
    const isDelete = confirm('Are you Sure want to delete this product');
    if (isDelete) {
      this.productSrv.deleteProduct(item.productId).subscribe((res: any) => {
        if (res.result) {
          this.getAllProducts();
          this.toastr.success('Xóa sẩn phẩm thành công!');
        } else if (res.error) {
          this.toastr.error('Xóa sẩn phẩm thất bại!');
        } else {
          console.log(res.message);
        }
      });
    }
  }

  searchProducts() {
    if (!this.searchValue) {
      this.filteredProductsList = this.productsList;
    } else {
      this.filteredProductsList = this.productsList.filter(product =>
        product.productName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        product.productSku.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

}
