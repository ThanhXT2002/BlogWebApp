import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BreadcrumbComponent } from '../layout/breadcrumb/breadcrumb.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IUser } from '../../../core/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { passwordMatchValidator } from '../../../core/validators/password-match.validator';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    TableModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {
  breadcrumbTitle: string = 'Quản Lý Danh Mục Thành Viên';
  sidebarTitle = 'none-title';
  sidebarVisible = false;
  userForm: FormGroup;
  users: IUser[] = [];
  editingUserKey: string | null = null;
  selectedFile: File | null = null;
  genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ];
  searchValue: string = '';
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        repeat_password: ['', Validators.required],
        phone: [''],
        address: [''],
        birthday: [''],
        gender: [this.genders[0].value],
        description: [''],
        publish: [true],
        role: [true],
      },
      { validators: passwordMatchValidator() }
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.loadUsers();
    this.userForm.patchValue({ gender: this.genders[0].value });
    // Kiểm tra và đặt giá trị cho role
    this.updateFormValidators();
    this.cdr.detectChanges();
  }

  loadUsers() {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.cdr.markForCheck();
        },
        error: (error) => console.error('Lỗi loading users:', error),
      });
  }

  openSidebar(user?: IUser) {
    this.sidebarVisible = true;
    this.sidebarTitle = user?.key
      ? 'Chỉnh sửa thành viên'
      : 'Thêm mới thành viên';
    this.editingUserKey = user?.key ?? null;

    if (user) {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        birthday: user.birthday,
        gender: user.gender || this.genders[0].value,
        description: user.description,
        publish: user.publish,
        role: user.role,
        password: '',
        repeat_password: ''
      });

    } else {
      this.userForm.reset({ publish: true, gender: this.genders[0].value, role: true });
    }

    this.updateFormValidators();
    this.userForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  onSave() {
    this.updateFormValidators();
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      delete formData.repeat_password;

      if (this.editingUserKey) {
        this.updateUser(this.editingUserKey, formData);
      } else {
        this.createUser(formData);
      }
    } else {
      this.handleInvalidForm();
    }
  }

  private createUser(formData: IUser) {
    this.userService.createUser(formData, this.selectedFile || undefined).subscribe({
      next: (userId) => {
        this.toastr.success('Khởi tạo thông tin thành công');
        this.handleSuccessfulOperation();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        if (error.message === 'Email đã tồn tại') {
          this.toastr.info('Email đã tồn tại, vui lòng thử lại! ');
        } else {
          this.toastr.warning('Có lỗi xảy ra trong quá trình tạo, vui lòng thử lại!');
        }
      }
    });
  }

  private updateUser(key: string, formData: Partial<IUser>) {
    // Loại bỏ email và password khỏi formData
    delete formData.email;
    delete formData.password;

    this.userService.updateUser(key, formData, this.selectedFile || undefined).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.toastr.success('Cập nhật thông tin thành công');
        this.handleSuccessfulOperation();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.toastr.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    });
  }

  private handleSuccessfulOperation() {
    this.loadUsers();
    this.sidebarVisible = false;
    this.resetForm();
    this.cdr.markForCheck();
  }

  private handleInvalidForm() {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      console.log(key, control?.errors);
    });
    this.toastr.warning('Vui lòng điền đầy đủ thông tin!');
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      this.selectedFile = file;
    }
  }

  resetForm() {
    this.userForm.reset({ publish: true });
    this.editingUserKey = null;
    this.selectedFile = null;
  }

  searchUsers() {
    if (!this.searchValue.trim()) {
      // Nếu searchValue trống, hiển thị tất cả users
      this.loadUsers();
      return;
    }

    const searchTerm = this.searchValue.toLowerCase().trim();

    this.users = this.users.filter(user =>
      (user.name?.toLowerCase() ?? '').includes(searchTerm) ||
      (user.email?.toLowerCase() ?? '').includes(searchTerm) ||
      (user.phone?.toLowerCase() ?? '').includes(searchTerm) ||
      (user.address?.toLowerCase() ?? '').includes(searchTerm)
    );
  }
  // Cập nhật phương thức clear
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.loadUsers(); // Lấy lại toàn bộ danh sách sau khi xóa
  }


  updateFormValidators() {
    const passwordControl = this.userForm.get('password');
    const repeatPasswordControl = this.userForm.get('repeat_password');

    if (this.editingUserKey) {
      passwordControl?.clearValidators();
      repeatPasswordControl?.clearValidators();
    } else {
      passwordControl?.setValidators([Validators.required]);
      repeatPasswordControl?.setValidators([Validators.required]);
    }

    passwordControl?.updateValueAndValidity();
    repeatPasswordControl?.updateValueAndValidity();
    this.userForm.updateValueAndValidity();
  }
}
