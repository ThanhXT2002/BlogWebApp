import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    BreadcrumbComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  breadcrumbTitle: string = 'Quản Lý Danh Mục Sản Phẩm';
}
