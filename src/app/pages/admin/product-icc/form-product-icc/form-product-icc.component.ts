import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../layout/breadcrumb/breadcrumb.component';
import { EditorModule } from 'primeng/editor';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { IProductIcc } from '../../../../core/models/product-icc.models';
import { ProductIccService } from '../../../../core/services/productIcc/product-icc.service';
import { ToastrService } from 'ngx-toastr';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { VideoUploadComponent } from '../../video-upload/video-upload.component';
import { of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-product-icc',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    EditorModule,
    ReactiveFormsModule,
    AngularEditorModule,
    ProgressSpinnerModule,
    FormsModule,
    CommonModule,
    ImageUploadComponent,
    VideoUploadComponent
  ],
  templateUrl: './form-product-icc.component.html',
  styleUrl: './form-product-icc.component.scss'
})
export class FormProductIccComponent {
  breadcrumbTitle: string = 'Thêm Sản Phẩm ICC';
  productForm: FormGroup;
  editingKey: string | null = null;

  constructor(
    private productIccService: ProductIccService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      shortTitle: ['', Validators.required],
      shortTitleMobile: ['', Validators.required],
      icon: [''],
      icon2: [''],
      image: [''],
      gif: [''],
      coverage: [''],
      interest: [''],
      description: [''],
      publish: [true]
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.editingKey = id;
          this.breadcrumbTitle = 'Chỉnh Sửa Sản Phẩm ICC';
          return this.productIccService.getById(id);
        }
        return of(null);
      })
    ).subscribe(product => {
      if (product) {
        this.productForm.patchValue(product);
      }
    });
  }

  onImageUrlChange(controlName: string, url: string) {
    this.productForm.get(controlName)?.setValue(url);
  }

  onVideoUrlChange(controlName: string, newUrl: string) {
    this.productForm.get(controlName)?.setValue(newUrl);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.editingKey) {
        this.updateProduct(this.editingKey, productData);
      } else {
        this.createProduct(productData);
      }
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  createProduct(productData: Omit<IProductIcc, 'key' | 'created_at' | 'updated_at'>) {
    this.productIccService.create(productData).subscribe({
      next: () => {
        this.toastr.success('Tạo sản phẩm thành công');
        this.router.navigate(['/admin/product-icc']);
      },
      error: (error) => {
        this.toastr.error('Lỗi khi tạo sản phẩm');
        console.error(error);
      }
    });
  }

  updateProduct(key: string, productData: Partial<IProductIcc>) {
    this.productIccService.update(key, productData).subscribe({
      next: () => {
        this.toastr.success('Cập nhật sản phẩm thành công');
        this.router.navigate(['/admin/product-icc']);
      },
      error: (error) => {
        this.toastr.error('Lỗi khi cập nhật sản phẩm');
        console.error(error);
      }
    });
  }

  getDefaultEditorConfig(height: string): AngularEditorConfig {
    return {
      editable: true,
      spellcheck: true,
      height: height,
      minHeight: '200px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Nhập nội dung tại đây...',
      defaultParagraphSeparator: 'div',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'center-image',
          class: 'center-image',
        },
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadWithCredentials: true,
      sanitize: true,
      toolbarPosition: 'top',
    };
  }

  editorConfigDescription: AngularEditorConfig = this.getDefaultEditorConfig('250px');
  editorConfigShortTitleMobile: AngularEditorConfig = this.getDefaultEditorConfig('100px');
  editorConfigCoverage: AngularEditorConfig = this.getDefaultEditorConfig('250px');
  editorConfigInterest: AngularEditorConfig = this.getDefaultEditorConfig('250px');
}
