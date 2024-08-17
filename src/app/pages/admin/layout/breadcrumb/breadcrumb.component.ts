import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: true, // Component được đánh dấu là standalone, không cần module để khai báo
  imports: [CommonModule, BreadcrumbModule],
  template: `
  <div class="w-full bg-gray-100 h-[100px] shadow-sm">
    <div class="pt-3 pl-5">
      <h1 class="text-3xl capitalize">
        {{title}}
      </h1>
    </div>
    <div class="pt-2 pl-5">
      <p><a routerLink="/admin/dashboard">Dashboard</a> / <span class="italic font-bold">{{title}}</span></p>

    </div>
  </div>
  `,
})
export class BreadcrumbComponent {
  // Input property để nhận title từ component cha
  // Giá trị mặc định được set để tránh lỗi khi không có giá trị được truyền vào
  @Input() title: string = 'Title Here Is Empty';



}
