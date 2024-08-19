import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { AuthService } from '../../../core/services/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm: FormGroup;
  currentUser: IUser | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  genders = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' }
  ];

  visible: boolean = false;



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      address: [''],
      birthday: [''],
      gender: ['male'],
      description: [''],
      image:[null]
    });

  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile() {
    if (this.currentUser && this.currentUser.key) {
      this.userService.getUser(this.currentUser.key).subscribe({
        next: (user) => {
          if (user) {
            this.currentUser = user;
            this.profileForm.patchValue({
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              birthday: user.birthday,
              gender: user.gender,
              description: user.description
            });
            this.imagePreview = user.image || null;
            this.authService.updateCurrentUser(user);  // Update the current user in AuthService
          } else {
            console.log("User data not found in database");
            this.toastr.error('Không tìm thấy thông tin người dùng', 'Lỗi');
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.toastr.error('Không thể tải thông tin người dùng', 'Lỗi');
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        if (this.currentUser) {
          this.currentUser.image = this.imagePreview;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  showDialog() {
    this.visible = true;
  }



  onSubmit() {
    if (this.profileForm.valid && this.currentUser?.key) {
      const updatedUser: Partial<IUser> = this.profileForm.value;
      const imageInput = document.getElementById('imageInput') as HTMLInputElement;
      const imageFile = imageInput.files?.[0];

      let updateObservable: Observable<IUser>;

      if (typeof this.imagePreview === 'string') {
        const base64Data = this.imagePreview.split(',')[1];
        const blob = this.dataURItoBlob(base64Data);
        const imageFile = new File([blob], "profile_image.jpg", { type: "image/jpeg" });
        updateObservable = this.userService.updateUser(this.currentUser.key, updatedUser, imageFile) as unknown as Observable<IUser>;
      } else if (imageFile) {
        updateObservable = this.userService.updateUser(this.currentUser.key, updatedUser, imageFile) as unknown as Observable<IUser>;
      } else {
        updateObservable = this.userService.updateUser(this.currentUser.key, updatedUser) as unknown as Observable<IUser>;
      }

      updateObservable.subscribe({
        next: (updatedUserData: IUser) => {


          // Cập nhật currentUser local
          this.currentUser = { ...this.currentUser, ...updatedUserData };

          // Cập nhật AuthService
          this.authService.saveUserData(this.currentUser);

          // Cập nhật form và preview
          this.profileForm.patchValue(this.currentUser);
          this.imagePreview = this.currentUser.image || null;

          // Đóng dialog nếu cần
          this.visible = false;
          this.toastr.success('Cập nhật thông tin thành công', 'Thành công');
        },
        error: (error: any) => {
          console.error('Error during update:', error);
          this.toastr.error('Cập nhật thông tin thất bại', 'Lỗi');
        }
      });
    }
  }

  // Helper function to convert base64 to Blob
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
