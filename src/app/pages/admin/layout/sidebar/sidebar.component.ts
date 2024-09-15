import { Component, computed, Input, input, signal } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav'
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from "../menu-item/menu-item.component";

export type MenuItemSidebar = {
  icon: string;
  label: string;
  route?:string;
  subItems?:MenuItemSidebar[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    MenuItemComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // Signal để theo dõi trạng thái thu gọn của sidebar
  sideNavCollapsed = signal(false);

  // Input property để nhận trạng thái collapsed từ component cha
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }

  // Computed property để tính toán class cho logo text
  textLogoClass = computed(() => ({
    'hidden': this.sideNavCollapsed()
  }));

  // Signal chứa danh sách các item trong menu
  menuItem = signal<MenuItemSidebar[]>([
    {
      icon:'dashboard',
      label: "Dashboard",
      route: 'dashboard'
    },
    {
      icon:'dns',
      label: "QL Sản Phẩm",
      subItems: [
        {
          icon:'pie_chart',
          label: "Sản phẩm",
          route: 'product'
        },
        {
          icon:'flip_to_back',
          label: "Loại sản phẩm",
          route: 'product-category'
        }
      ]
    },
    {
      icon:'dns',
      label: "QL Sản Phẩm Icc",
      route: 'product-icc'
    },
    {
      icon:'filter_b_and_w',
      label: "QL Bài Viết",
      subItems: [
        {
          icon:'filter_tilt_shift',
          label: "Bài viết",
          route: 'post'
        },
        {
          icon:'markunread_mailbox',
          label: "Loại bài viết",
          route: 'post-category'
        }
      ]
    },
    {
      icon:'account_circle',
      label: "Thành viên",
      route: 'user'
    },
    {
      icon:'insert_drive_file',
      label: "QL File",
      route: '/admin/file-manager'
    },
    {
      icon:'comment',
      label: "QL Bình luận",
      route: 'comment'
    },
    {
      icon:'perm_contact_calendar',
      label: "QL Liên hệ",
      route: 'contact-list'
    },
    {
      icon:'image',
      label: "Ảnh Trang Giới Thiệu",
      route: 'image-about'
    },
    {
      icon:'compare',
      label: "QL Banner",
      route: 'banner'
    },
    {
      icon:'menu',
      label: "QL Menu",
      route: 'menu'
    },
    {
      icon:'settings',
      label: "Cấu Hình Hệ Thống",
      route: 'system'
    },

  ]);

  // Hàm ngăn chặn hành vi mặc định của sự kiện click
  preventDefault(event: Event) {
    event.preventDefault();
  }

}
