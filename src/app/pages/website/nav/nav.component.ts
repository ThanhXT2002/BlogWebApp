import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../core/models/user.model';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit{

  currentUser: IUser | null = null;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()
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
