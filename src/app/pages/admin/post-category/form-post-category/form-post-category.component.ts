import { PostCategoryService } from './../../../../core/services/pos-category/post-category.service';
import { Component , ElementRef, OnInit, ViewChild} from '@angular/core';
import { BreadcrumbComponent } from "../../layout/breadcrumb/breadcrumb.component";
import { EditorModule } from 'primeng/editor';
import { FormBuilder,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { finalize, map, Observable} from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { UploadFileService } from '../../../../core/services/upload/upload-file.service';
import { CommonModule } from '@angular/common';
import { Select2Module , Select2Option  } from 'ng-select2-component';
import {  } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IPostCategory } from '../../../../core/models/post-category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



interface UploadResponse {
  imageUrl: string;
  html?: string;
}
@Component({
  selector: 'app-form-post-category',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    EditorModule,
    ReactiveFormsModule,
    AngularEditorModule,
    ProgressSpinnerModule,
    FormsModule,
    CommonModule,
    Select2Module,
    NgxDropzoneModule

  ],
  templateUrl: './form-post-category.component.html',
  styleUrl: './form-post-category.component.scss'
})
export class FormPostCategoryComponent implements OnInit{
  breadcrumbTitle: string = 'Form Save Loại Bài Viết';
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageFile: File | undefined = undefined;
  @ViewChild('previewImage') previewImage!: ElementRef;

  files: (File | { preview: string })[] = [];

  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  htmlContent: string = '';
  htmlDescription: string = '';
  postCategoryForm!: FormGroup;
  select2Data: any[] = [];
  categoryId: string | null = null;
  // end

  newFiles: File[] = []; // Chỉ chứa File objects mới
  existingFiles: { file: File, base64: string }[] = [];// Chứa base64 strings của ảnh có sẵn

  isEditMode: boolean = false;
  categories: IPostCategory[] = [];

  overlay: boolean = false;



  constructor(
    private uploadFileService: UploadFileService,
    private postCategoryService: PostCategoryService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.postCategoryForm = this.fb.group({
      parent_id: [''],
      title: ['', Validators.required],
      description: [''],
      content: [''],
      publish: [true],
    });
  }
  ngOnInit() {

    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;
    this.loadCategorySelect();
    if (this.isEditMode) {
      this.loadCategoryData();
    }
  }

  loadCategorySelect() {
    this.postCategoryService.getHierarchicalCategories().subscribe({
      next: (categories) => {
        this.select2Data = [
          { value: '', label: 'Là danh mục cha' },
          ...categories.filter(cat => cat.key !== this.categoryId).map(cat => ({
            value: cat.key,
            label: cat.label
          }))
        ];
        // Đặt giá trị mặc định cho FormControl 'parent_id'
      this.postCategoryForm.controls['parent_id'].setValue('');
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  /////////////////////////////////

  isFile(file: any): file is File {
    return file instanceof File;
  }


  createFileFromBase64(base64String: string, fileName: string = 'image.jpg'): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error('Invalid base64 string');
    }
    const mimeType = mime[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mimeType });
  }

  loadCategoryData() {
    if (this.categoryId) {
      this.isLoading = true;
      this.postCategoryService.getPostCategory(this.categoryId).subscribe({
        next: (category) => {
          if (category) {
            this.postCategoryForm.patchValue(category);
            this.htmlDescription = category.description || '';
            this.htmlContent = category.content || '';

            if (category.image) {
              this.imagePreview = category.image; // Đã là base64
            }
            // Xử lý album ảnh
            if (category.album && Array.isArray(category.album)) {
              this.existingFiles = category.album.map((base64String, index) => {
                try {
                  const file = this.createFileFromBase64(base64String, `existing-image-${index}.jpg`);
                  return { file, base64: base64String };
                } catch (error) {
                  console.error('Error converting base64 to File:', error);
                  return null;
                }
              }).filter(item => item !== null) as { file: File, base64: string }[];
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading category:', error);
          this.toastr.error('Lỗi khi tải dữ liệu danh mục');
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.postCategoryForm.valid) {
      this.isLoading = true;
      if (this.isEditMode) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    } else {
      this.postCategoryForm.markAllAsTouched();
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  }

  createCategory() {
    const categoryData = this.prepareCategoryData();

    this.postCategoryService.create(categoryData).subscribe({
      next: (createdCategory) => {
        this.isLoading = false;
        this.toastr.success('Tạo danh mục bài viết thành công!');
        this.router.navigate(['/admin/post-category']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating post category:', error);
        this.toastr.error('Có lỗi xảy ra khi tạo danh mục bài viết!');
      }
    });
  }

  updateCategory() {
    if (!this.categoryId) return;

    const categoryData = this.prepareCategoryData();

    this.postCategoryService.update(this.categoryId, categoryData).subscribe({
      next: (updatedCategory) => {
        this.isLoading = false;
        this.toastr.success('Cập nhật danh mục bài viết thành công!');
        setTimeout(() => {
          this.router.navigate(['/admin/post-category']);
        }, 100);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating post category:', error);
        this.toastr.error('Có lỗi xảy ra khi cập nhật danh mục bài viết!');
      }
    });
  }

  private prepareCategoryData(): Omit<IPostCategory, 'key' | 'slug' | 'created_at' | 'updated_at'> & { imageFile?: File, albumFiles?: File[] } {
    const formData = this.postCategoryForm.value;


    return {
      title: formData.title,
      parent_id: formData.parent_id || null,
      description: this.htmlDescription || null,
      content: this.htmlContent || null,
      publish: formData.publish ?? true,
      image: this.imagePreview || null,
      album: [...this.existingFiles.map(f => f.base64), ...this.newFiles.map(() => '')],
      imageFile: this.imageFile || undefined,
      albumFiles: this.newFiles.length > 0 ? this.newFiles : undefined,
    };
  }

  // done
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      // Nếu bạn muốn hiển thị preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  //frop:

  onSelect(event: { addedFiles: File[] }) {
    this.newFiles.push(...event.addedFiles);
  }

  onRemove(file: File) {
    this.newFiles = this.newFiles.filter(f => f !== file);
  }

  onRemoveExisting(fileItem: { file: File, base64: string }) {
    this.existingFiles = this.existingFiles.filter(f => f !== fileItem);
  }
  //end drop

  getDefaultEditorConfig(uploadType: string, height: string): AngularEditorConfig {
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
      placeholder: 'Enter text here...',
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
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
        this.isLoading = true;
        return this.uploadFileService.uploadImage(file, uploadType).pipe(
          map(event => {
            if (event instanceof HttpResponse) {
              const imageUrl = event.body?.imageUrl;
              if (imageUrl) {
                return new HttpResponse<UploadResponse>({
                  body: { imageUrl: imageUrl }
                });
              }
            }
            return event;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
      }
    };
  }
  // Sử dụng hàm để tạo cấu hình
  editorConfigDescription: AngularEditorConfig = this.getDefaultEditorConfig('upload_description_post_cate', '250px');
  editorConfigContent: AngularEditorConfig = this.getDefaultEditorConfig('upload_content_post_cate', '550px');

}


  // search(text: string) {
  //   if (!text) {
  //     this.filteredData = this.originalData;
  //   } else {
  //     const lowercasedText = text.toLowerCase();
  //     this.filteredData = this.originalData
  //       .map(group => ({
  //         ...group,
  //         options: group.options.filter(option =>
  //           option.label.toLowerCase().includes(lowercasedText)
  //         )
  //       }))
  //       .filter(group => group.options.length > 0);
  //   }
  // }
  // onSearch(event: { search: string }) {
  //   this.search(event.search);
  // }
