import { PostService } from '../../../../core/services/post/post.service';
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
import { PostCategoryService } from '../../../../core/services/pos-category/post-category.service';
import { IPost } from '../../../../core/models/post.model';


interface UploadResponse {
  imageUrl: string;
  html?: string;
}
@Component({
  selector: 'app-form-post',
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
  templateUrl: './form-post.component.html',
  styleUrl: './form-post.component.scss'
})
export class FormPostComponent {
  breadcrumbTitle: string = 'Form Lưu Bài Viết';
  isLoading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageFile: File | undefined = undefined;
  @ViewChild('previewImage') previewImage!: ElementRef;
  files: (File | { preview: string })[] = [];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  htmlContent: string = '';
  htmlDescription: string = '';
  postForm!: FormGroup;
  select2Data: any[] = [];
  postId: string | null = null;

  newFiles: File[] = []; // Chỉ chứa File objects mới
  existingFiles: { file: File, base64: string }[] = [];// Chứa base64 strings của ảnh có sẵn

  isEditMode: boolean = false;
  categories: IPostCategory[] = [];
  posts: IPost[] = [];

  overlay: boolean = false;


  constructor( private uploadFileService: UploadFileService,
    private postService: PostService,
    private postCategoryService: PostCategoryService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,){
      this.postForm = this.fb.group({
        post_category_id: [[], Validators.required],
        title: ['', Validators.required],
        description: [''],
        content: [''],
        publish: [true],
      });
    }

    ngOnInit() {

      this.postId = this.route.snapshot.paramMap.get('id');
      this.isEditMode = !!this.postId;
      this.loadCategories();
      if (this.isEditMode) {
        this.loadPostData();
      }
    }

    loadCategories() {
      this.postCategoryService.getHierarchicalCategories().subscribe({
        next: (categories) => {
          this.select2Data = categories.map(cat => ({
            value: cat.key,
            label: cat.label
          }));
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
    }

    onSubmit() {
      if (this.postForm.valid) {
        this.isLoading = true;
        if (this.isEditMode) {
          this.updatePost();
        } else {
          this.createPost();
        }
      } else {
        this.postForm.markAllAsTouched();
        this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      }
    }

    createPost() {
      const PostData = this.preparePostData();
      this.isLoading = true;
      this.postService.create(PostData).subscribe({
        next: (created) => {
          this.isLoading = false;
          this.toastr.success('Tạo bài viết thành công!');
          this.router.navigate(['/admin/post']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating post category:', error);
          this.toastr.error('Có lỗi xảy ra khi tạo bài viết!');
        }
      });
    }

    updatePost() {
      if (!this.postId) return;

      const PostData = this.preparePostData();

      this.postService.update(this.postId, PostData).subscribe({
        next: (updated) => {
          this.isLoading = false;
          this.toastr.success('Cập nhật bài viết thành công!');
          this.router.navigate(['/admin/post']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating post category:', error);
          this.toastr.error('Có lỗi xảy ra khi cập nhật  bài viết!');
        }
      });
    }

    private preparePostData(): Omit<IPost, 'key' | 'slug' | 'created_at' | 'updated_at'> & { imageFile?: File, albumFiles?: File[] } {
      const formData = this.postForm.value;
      return {
        title: formData.title,
        post_category_id: formData.post_category_id || [],
        description: this.htmlDescription || null,
        content: this.htmlContent || null,
        publish: formData.publish ?? true,
        image: this.imagePreview,
        album: [...this.existingFiles.map(f => f.base64), ...this.newFiles.map(() => '')],
        imageFile: this.imageFile || undefined,
        albumFiles: this.newFiles.length > 0 ? this.newFiles : undefined,
      };
    }


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

    loadPostData() {
      if (this.postId) {
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe({
          next: (post) => {
            if (post) {
              const postCategoryId = Array.isArray(post.post_category_id)
            ? post.post_category_id
            : post.post_category_id ? [post.post_category_id] : [];

               this.postForm.patchValue({
                ...post,
                post_category_id: postCategoryId
              });
              this.htmlDescription = post.description || '';
              this.htmlContent = post.content || '';

              if (post.image) {
                this.imagePreview = post.image; // Đã là base64
              }

              // Xử lý album ảnh
              if (post.album && Array.isArray(post.album)) {
                this.existingFiles = post.album.map((base64String, index) => {
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
            console.error('Error loading post:', error);
            this.toastr.error('Lỗi khi tải dữ liệu danh mục');
            this.isLoading = false;
          }
        });
      }
    }
  //ảnh đại diện
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

  // drop album
  onSelect(event: { addedFiles: File[] }) {
    this.newFiles.push(...event.addedFiles);
  }

  onRemove(file: File) {
    this.newFiles = this.newFiles.filter(f => f !== file);
  }

  onRemoveExisting(fileItem: { file: File, base64: string }) {
    this.existingFiles = this.existingFiles.filter(f => f !== fileItem);
  }

  // rich-editor

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
    editorConfigDescription: AngularEditorConfig = this.getDefaultEditorConfig('upload_description_post', '250px');
    editorConfigContent: AngularEditorConfig = this.getDefaultEditorConfig('upload_content_post', '550px');
}
