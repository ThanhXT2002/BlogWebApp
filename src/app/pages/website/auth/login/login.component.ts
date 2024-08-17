import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(){
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/home']);
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
