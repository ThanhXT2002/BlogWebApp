import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/authentication/auth.service';
import { IUser } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const password2 = control.get('password2');

    if (password && password2 && password.value !== password2.value) {
      password2.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      password2?.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: IUser = {
        name: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      this.authService.register(user).subscribe({
        next: () => {
          this.toastr.success('Đăng ký tài khoản thành công!', 'Success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Lỗi đăng ký:', error);
          if (typeof error === 'string') {
            this.toastr.error(error, 'Error');
          } else {
            this.toastr.error('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.', 'Error');
          }
        }
      });
    } else {
      this.toastr.error('Xin vui lòng điền đầy đủ thông tin.', 'Error');
    }
  }
}
