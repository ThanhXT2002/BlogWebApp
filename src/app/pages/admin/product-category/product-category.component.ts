import { Component } from '@angular/core';

import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
breadcrumbTitle: string = "Quản Lý Danh Mục Loại Sản Phẩm"

}
