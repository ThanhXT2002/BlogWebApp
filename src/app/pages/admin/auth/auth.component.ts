import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/authentication/auth.service';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loginForm = this.fb.group({
    EmailId: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    if (this.loginForm.valid) {
      const { EmailId, Password } = this.loginForm.value;
      this.authService.login(EmailId!, Password!).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/admin/dashboard']);
            this.toastr.success("Đăng nhập thành công!");
          } else {
            this.toastr.error("Email hoặc mật khẩu không chính xác" );
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.code === 'auth/invalid-credential') {
            this.toastr.error("Thông tin xác thực không hợp lệ, vui lòng thử lại." );
          } else if (error.code === 'auth/too-many-requests') {
            this.toastr.error("Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại. Vui lòng thử lại sau hoặc đặt lại mật khẩu.", "Tài khoản bị khóa!");
          } else {
            this.toastr.error("Có lỗi xảy ra trong quá trình đăng nhập, vui lòng thử lại sau." );
          }
        }
      });
    } else {
      this.toastr.error("Vui lòng điền đầy đủ thông tin" );
    }
  }


}
