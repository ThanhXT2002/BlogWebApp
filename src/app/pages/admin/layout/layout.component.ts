
import { CommonModule  } from "@angular/common";
import { Component, OnInit, OnDestroy, signal, computed, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet, RouterModule, Router } from "@angular/router";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../core/services/authentication/auth.service";
import { IUser } from "../../../core/models/user.model";

// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet,
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,

  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit{
  // Signal để theo dõi trạng thái thu gọn của sidebar
  collapsed = signal(false);

  currentUser: IUser | null = null;


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  // Computed property để tính toán chiều rộng của sidebar dựa trên trạng thái collapsed
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');

  onLogout() {
    this.authService.logout().then(() => {
      this.toastr.success('Đăng xuất thành công.');
      this.router.navigate(['/admin/login']);

    }).catch((error) => {
      // Xử lý nếu có lỗi xảy ra trong quá trình đăng xuất
      console.error('Đăng xuất thất bại', error);
      this.toastr.error('Đăng xuất Thất bại.','Lỗi!')
    });
  }

}
