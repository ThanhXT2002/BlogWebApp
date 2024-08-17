import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/authentication/auth.service';
import { Component, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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

  onLogout() {
    this.authService.logout().then(() => {
      this.toastr.success('Đăng xuất thành công.','Thành công!');
      this.router.navigate(['/admin/login']);

    }).catch((error) => {
      // Xử lý nếu có lỗi xảy ra trong quá trình đăng xuất
      console.error('Đăng xuất thất bại', error);
      this.toastr.error('Đăng xuất Thất bại.','Lỗi!')
    });
  }
}
