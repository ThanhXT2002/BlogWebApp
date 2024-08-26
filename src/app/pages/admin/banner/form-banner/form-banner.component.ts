import { Component ,ViewChild, ElementRef  } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BreadcrumbComponent } from "../../layout/breadcrumb/breadcrumb.component";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BannerService } from '../../../../core/services/banner/banner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBanner, IBannerImage } from '../../../../core/models/banner.model';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastrService } from 'ngx-toastr';
import { TabViewModule } from 'primeng/tabview';
import { DragDropModule, moveItemInArray , CdkDragDrop } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-banner',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Select2Module,
    InputSwitchModule,
    TabViewModule,
    DragDropModule
  ],
  templateUrl: './form-banner.component.html',
  styleUrl: './form-banner.component.scss'
})
export class FormBannerComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  breadcrumbTitle:string = 'Thêm mới Banner'
  bannerForm: FormGroup;
  isEditMode = false;
  bannerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) {
    this.bannerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      keyWord: ['', Validators.required],
      height: [null],
      width: [null],
      effect: [''],
      publish: [true],
      arrow: [false],
      navigation: ['hidden'],
      autoplay: [true],
      accept: [false],
      animationDelay: [0],
      animationSpeed: [0],
      shortCode: [''],
      album: this.fb.array([])
    });
  }

  get albumFormArray() {
    return this.bannerForm.get('album') as FormArray;
  }

  addImage() {
    const imageForm = this.fb.group({
      imgDescription: [''],
      url: [''],
      newTab: [true],
      name: [''],
      alt: [''],
      image: ['']
    });
    this.albumFormArray.push(imageForm);
  }

  removeImage(index: number) {
    const imageForm = this.albumFormArray.at(index);
    const imageUrl = imageForm.get('image')?.value;

    if (imageUrl) {
      // Lấy tham chiếu đến file trong Firebase Storage
      const fileRef = this.storage.refFromURL(imageUrl);

      // Xóa file khỏi Firebase Storage
      fileRef.delete().subscribe({
        next: () => {
          // File đã được xóa thành công, giờ xóa khỏi form array
          this.albumFormArray.removeAt(index);
          this.toastr.success('Đã xóa ảnh thành công');
        },
        error: (error) => {
          console.error('Lỗi khi xóa file:', error);
          this.toastr.error('Lỗi khi xóa ảnh từ kho lưu trữ');
          // Tùy chọn, bạn vẫn có thể muốn xóa nó khỏi form array
          // this.albumFormArray.removeAt(index);
        }
      });
    } else {
      // Nếu không có URL ảnh, chỉ cần xóa khỏi form array
      this.albumFormArray.removeAt(index);
    }
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.uploadImage(files[i]);
      }
    }
    // Reset file input
    this.fileInput.nativeElement.value = '';
  }

  addImageToForm(image: IBannerImage) {
    const imageForm = this.fb.group({
      imgDescription: [image.imgDescription || ''],
      url: [image.url || ''],
      newTab: [image.newTab || true],
      name: [image.name || ''],
      alt: [image.alt || ''],
      image: [image.image || '']
    });
    this.albumFormArray.push(imageForm);
  }


  uploadImage(file: File) {
    const filePath = `banners/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.addImage(); // Thêm một form mới
          const lastIndex = this.albumFormArray.length - 1;
          this.albumFormArray.at(lastIndex).patchValue({
            image: url,
            name: file.name
          });
        });
      })
    ).subscribe();
  }



  ngOnInit() {
    this.bannerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bannerId;

    if (this.isEditMode && this.bannerId) {
      this.breadcrumbTitle='Chỉnh sửa Banner';
      this.loadBannerData(this.bannerId);
    } else {
      this.bannerForm.patchValue({
        shortCode: this.bannerService.generateShortCode()
      });
    }
  }

  loadBannerData(id: string) {
    this.bannerService.getBanner(id).subscribe({
      next: (banner) => {
        if (banner) {
          this.bannerForm.patchValue(banner);
          banner.album.forEach(image => this.addImageToForm(image));
        }
      },
      error: (error) => {
        this.toastr.error('Error loading banner data');
        console.error(error);
      }
    });
  }


  dataSelect2: any = [
        { value: 'fade', label: 'Fade' },
        { value: 'cube', label: 'Cube'},
        { value: 'coverflow', label: 'Coverflow' },
        { value: 'flip', label: 'Flip' },
        { value: 'cards', label: 'Cards' },
        { value: 'creative', label: 'Creative' },
  ]

  onSubmit() {
    if (this.bannerForm.valid) {
      const bannerData: Partial<IBanner> = this.bannerForm.value;

      if (this.isEditMode && this.bannerId) {
        this.bannerService.update(this.bannerId, bannerData).subscribe({
          next: () => {
            this.toastr.success('Cập nhật banner thành công!');
            this.router.navigate(['/admin/banner']);
          },
          error: (error) => {
            this.toastr.error('Cập nhật banner thất bại');
            console.error(error);
          }
        });
      } else {
        this.bannerService.create(bannerData as Omit<IBanner, 'key' | 'created_at' | 'updated_at'>).subscribe({
          next: () => {
            this.toastr.success('Tạo mới banner thành công!');
            this.router.navigate(['/admin/banner']);
          },
          error: (error) => {
            this.toastr.error('Lỗi khi tạo mới!');
            console.error(error);
          }
        });
      }
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin cần thiết');
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    const formArray = this.bannerForm.get('album') as FormArray;
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
    formArray.updateValueAndValidity();
  }
}
