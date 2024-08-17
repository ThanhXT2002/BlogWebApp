import { Component, input, signal } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav'
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { MenuItemSidebar } from '../sidebar/sidebar.component';
import { trigger, animate, style, transition } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  animations:[
    trigger('expandContractMenu',[
      transition(':enter',[
        style({opacity:0, height:'0px' }),
        animate('300ms ease-in-out', style({opacity: 1, height:'*'}))

      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({opacity: 0, height:'0px'}))
      ])
    ])
  ],
  imports: [
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
   // Định nghĩa một input property bắt buộc có kiểu MenuItemSidebar
  // Sử dụng cú pháp mới của Angular để tạo input property
  // Giá trị này phải được cung cấp khi sử dụng component
  /*
  .required: Đây là một modifier chỉ ra rằng input này là bắt buộc. Nó đảm bảo rằng một giá trị phải được cung cấp cho property này khi sử dụng component.

  */
  item = input.required<MenuItemSidebar>()

 // Định nghĩa một input property không bắt buộc kiểu boolean
  // Mặc định là false nếu không được cung cấp
  // Được sử dụng để xác định trạng thái thu gọn của menu
  collapsed = input(false);

  // Tạo một signal để theo dõi trạng thái mở/đóng của menu con
  // Mặc định là false (đóng)
  // Sử dụng signal cho phép theo dõi và phản ứng với các thay đổi trạng thái
  nestedMenuOpen = signal(false);


  // Hàm để toggle trạng thái mở/đóng của menu con
  toggleNested(){
    // Kiểm tra xem item hiện tại có menu con không
    if(!this.item().subItems){
      return;// Nếu không có menu con, không làm gì cả
    }
    // Đảo ngược trạng thái hiện tại của nestedMenuOpen
    // Sử dụng phương thức set của signal để cập nhật giá trị
    this.nestedMenuOpen.set(!this.nestedMenuOpen())
  }

  // Hàm ngăn chặn hành vi mặc định của sự kiện
  // Thường được sử dụng để ngăn chặn việc reload trang khi click vào link
  preventDefault(event: Event) {
    event.preventDefault();
  }
}
