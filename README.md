# AngularProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


user_table:
  id
  name
  email (unique)
  password
  phone
  address
  birthday
  image
  gender
  description
  publish
  rememberToken
  crated_at
  updated_at

post_category:
  key
  parend_id
  slug
  title
  short_description
  content
  album
  image
  publish
  order
  user_id
  crated_at
  updated_at

post:
  key
  slug
  title
  description
  content
  album
  image
  publish
  user_id
  post_category_id
  crated_at
  updated_at


 // uploadUrl: 'https://api.escuelajs.co/api/v1/files/upload',
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      return new Observable<HttpEvent<UploadResponse>>((observer) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        // Giả lập HTTP request sử dụng FormData
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const base64 = e.target.result as string;

            // Tạo HTML cho ảnh căn giữa
            const imageHtml = `<div style="text-align: center;display: flex;justify-content: center;"><img src="${base64}" alt="Image"></div>`;

            // Giả lập response từ server với imageUrl là HTML đã tạo
            const response: HttpResponse<UploadResponse> = new HttpResponse({
              body: { imageUrl: imageHtml }
            });

            observer.next(response);
            observer.complete();
          };
          reader.onerror = (error) => {
            observer.error(error);
          };
          reader.readAsDataURL(file);
        }, 1000); // Giả lập độ trễ network
      });
    }

      onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.insertImage(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  insertImage(base64: string) {
    this.htmlContent += `<div style="text-align: center;display: flex;justify-content: center;"><img src="${base64}" alt="Image"></div>`;
  }


///////

import { Component , OnInit} from '@angular/core';
import { BreadcrumbComponent } from "../../../layout/breadcrumb/breadcrumb.component";
import { EditorModule } from 'primeng/editor';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-form-post-category',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    EditorModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './form-post-category.component.html',
  styleUrl: './form-post-category.component.scss'
})
export class FormPostCategoryComponent implements OnInit{
  breadcrumbTitle: string = 'Form Save Loại Bài Viết';
  formGroup: FormGroup | undefined;
  isLoading: boolean = false;

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl()
        });
    }
    editorConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '250px',
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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
        return this.editorboxService.uploadImage(file).pipe(
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
    }
}


 originalData: GroupOption[] = [
    {
      label: 'Trần',
      options: [
        { value: 'XT', label: 'Trần Xuân Thành' },
        { value: 'KS', label: 'Trần Thị Kim Sinh', disabled: true },
        { value: 'VN', label: 'Trần Văn Name' },
        { value: 'TT', label: 'Trần Thị Thu' },
        { value: 'TD', label: 'Trần Đại Dương', disabled: true },
        { value: 'TC', label: 'Trần Công Chính' },
        { value: 'TB', label: 'Trần Bảo Anh' },
      ],
    },
    {
      label: 'Phạm',
      options: [
        { value: 'HE', label: 'Phạm Hữu Ét' },
        { value: 'HH', label: 'Phạm Hữu Hùng', disabled: true },
        { value: 'TT', label: 'Phạm Thị Thủy' },
        { value: 'HT', label: 'Phạm Hữu Tâm' },
        { value: 'TA', label: 'Phạm Thị Anh' },
        { value: 'VN', label: 'Phạm Văn Nam', disabled: true },
        { value: 'PC', label: 'Phạm Công Chí' },
      ],
    },
    {
      label: 'Nguyễn',
      options: [
        { value: 'VN', label: 'Nguyễn Văn Nam' },
        { value: 'VH', label: 'Nguyễn Vũ Hoàng', disabled: true },
        { value: 'HC', label: 'Nguyễn Hữu Công' },
        { value: 'VD', label: 'Nguyễn Văn Đà' },
        { value: 'TL', label: 'Nguyễn Thị Lan' },
        { value: 'TT', label: 'Nguyễn Thanh Tùng' },
        { value: 'TN', label: 'Nguyễn Thị Nhung' },
      ],
    },
    {
      label: 'Lê',
      options: [
        { value: 'LT', label: 'Lê Thị Tuyết' },
        { value: 'LH', label: 'Lê Hữu Hạnh', disabled: true },
        { value: 'LV', label: 'Lê Văn Việt' },
        { value: 'LN', label: 'Lê Nam', disabled: true },
        { value: 'LH', label: 'Lê Hồng' },
        { value: 'LP', label: 'Lê Phương Anh' },
      ],
    },
    {
      label: 'Vũ',
      options: [
        { value: 'VH', label: 'Vũ Hữu Hòa' },
        { value: 'VT', label: 'Vũ Thị Thanh', disabled: true },
        { value: 'VD', label: 'Vũ Đại Dương' },
        { value: 'VC', label: 'Vũ Cao Cường' },
        { value: 'VH', label: 'Vũ Huy Hoàng' },
        { value: 'VB', label: 'Vũ Bảo Ngọc', disabled: true },
      ],
    },
    {
      label: 'Hoàng',
      options: [
        { value: 'HN', label: 'Hoàng Nam' },
        { value: 'HH', label: 'Hoàng Hữu Hạnh' },
        { value: 'HT', label: 'Hoàng Thị Thu', disabled: true },
        { value: 'HV', label: 'Hoàng Văn Vinh' },
        { value: 'HT', label: 'Hoàng Thái' },
        { value: 'HP', label: 'Hoàng Phương Mai' },
      ],
    },
    {
      label: 'Đỗ',
      options: [
        { value: 'DN', label: 'Đỗ Nam', disabled: true },
        { value: 'DH', label: 'Đỗ Hữu Hoàng' },
        { value: 'DT', label: 'Đỗ Thị Tuyết' },
        { value: 'DV', label: 'Đỗ Văn Việt' },
        { value: 'DH', label: 'Đỗ Hồng' },
        { value: 'DP', label: 'Đỗ Phương Linh' },
      ],
    },
    {
      label: 'Bùi',
      options: [
        { value: 'BN', label: 'Bùi Nam' },
        { value: 'BH', label: 'Bùi Hữu Hoàng', disabled: true },
        { value: 'BT', label: 'Bùi Thị Thu' },
        { value: 'BV', label: 'Bùi Văn Việt' },
        { value: 'BL', label: 'Bùi Long' },
        { value: 'BP', label: 'Bùi Phương Anh' },
      ],
    },
    {
      label: 'Đinh',
      options: [
        { value: 'DA', label: 'Đinh Anh Tuấn', disabled: true },
        { value: 'DL', label: 'Đinh Lan Hương' },
        { value: 'DV', label: 'Đinh Văn Hưng' },
        { value: 'DT', label: 'Đinh Thị Tuyết' },
        { value: 'DH', label: 'Đinh Hoàng Anh' },
      ],
    },
    {
      label: 'Lý',
      options: [
        { value: 'LA', label: 'Lý Anh Dũng' },
        { value: 'LH', label: 'Lý Hữu Hải', disabled: true },
        { value: 'LT', label: 'Lý Thị Hằng' },
        { value: 'LV', label: 'Lý Văn Khoa' },
        { value: 'LC', label: 'Lý Cao Thắng' },
      ],
    },
    {
      label: 'Phan',
      options: [
        { value: 'PA', label: 'Phan Anh Tú' },
        { value: 'PH', label: 'Phan Hữu Hoàng' },
        { value: 'PT', label: 'Phan Thị Tuyết', disabled: true },
        { value: 'PV', label: 'Phan Văn Bình' },
        { value: 'PL', label: 'Phan Lan Anh' },
      ],
    },
    {
      label: 'Võ',
      options: [
        { value: 'VA', label: 'Võ Anh Khoa' },
        { value: 'VT', label: 'Võ Thị Mai', disabled: true },
        { value: 'VC', label: 'Võ Công Đạt' },
        { value: 'VH', label: 'Võ Hữu Thắng' },
        { value: 'VL', label: 'Võ Lan Hương' },
      ],
    },
    {
      label: 'Hồ',
      options: [
        { value: 'HA', label: 'Hồ Anh Tuấn' },
        { value: 'HT', label: 'Hồ Thị Thanh', disabled: true },
        { value: 'HV', label: 'Hồ Văn Sơn' },
        { value: 'HC', label: 'Hồ Công Thành' },
        { value: 'HH', label: 'Hồ Hữu Hải' },
      ],
    },
    {
      label: 'Đào',
      options: [
        { value: 'DA', label: 'Đào Anh Dũng' },
        { value: 'DH', label: 'Đào Hữu Nghĩa' },
        { value: 'DT', label: 'Đào Thị Bích' },
        { value: 'DV', label: 'Đào Văn Hùng', disabled: true },
        { value: 'DP', label: 'Đào Phương Thảo' },
      ],
    },
    {
      label: 'Mai',
      options: [
        { value: 'MA', label: 'Mai Anh Tuấn' },
        { value: 'MT', label: 'Mai Thị Hương' },
        { value: 'MV', label: 'Mai Văn Hoàng', disabled: true },
        { value: 'MH', label: 'Mai Hữu Phúc' },
        { value: 'ML', label: 'Mai Lan Chi' },
      ],
    },
    {
      label: 'Tô',
      options: [
        { value: 'TA', label: 'Tô Anh Quân' },
        { value: 'TL', label: 'Tô Lan Phương' },
        { value: 'TT', label: 'Tô Thị Bích', disabled: true },
        { value: 'TV', label: 'Tô Văn Thành' },
        { value: 'TH', label: 'Tô Hữu Nghĩa' },
      ],
    },
    {
      label: 'Chu',
      options: [
        { value: 'CA', label: 'Chu Anh Khoa' },
        { value: 'CT', label: 'Chu Thị Nhung' },
        { value: 'CV', label: 'Chu Văn Hải' },
        { value: 'CH', label: 'Chu Hữu Nghĩa', disabled: true },
        { value: 'CL', label: 'Chu Lan Anh' },
      ],
    },
    {
      label: 'Quách',
      options: [
        { value: 'QA', label: 'Quách Anh Quân' },
        { value: 'QT', label: 'Quách Thị Ngọc', disabled: true },
        { value: 'QV', label: 'Quách Văn Hùng' },
        { value: 'QH', label: 'Quách Hữu Tùng' },
        { value: 'QL', label: 'Quách Lan Phương' },
      ],
    },
    {
      label: 'Khổng',
      options: [
        { value: 'KA', label: 'Khổng Anh Tài' },
        { value: 'KT', label: 'Khổng Thị Nhung' },
        { value: 'KV', label: 'Khổng Văn Quang', disabled: true },
        { value: 'KH', label: 'Khổng Hữu Đạt' },
        { value: 'KL', label: 'Khổng Lan Anh' },
      ],
    },
    {
      label: 'Mạc',
      options: [
        { value: 'MA', label: 'Mạc Anh Tuấn', disabled: true },
        { value: 'MT', label: 'Mạc Thị Hằng' },
        { value: 'MV', label: 'Mạc Văn Long' },
        { value: 'MH', label: 'Mạc Hữu Tâm' },
        { value: 'ML', label: 'Mạc Lan Hương' },
      ],
    },
    {
      label: 'Lưu',
      options: [
        { value: 'LA1', label: 'Lưu Anh Tuấn' },
        { value: 'LA2', label: 'Lưu Anh Khoa' },
        { value: 'LA3', label: 'Lưu Anh Minh' },
        { value: 'LT1', label: 'Lưu Thị Mai', disabled: true },
        { value: 'LT2', label: 'Lưu Thị Lan' },
        { value: 'LT3', label: 'Lưu Thị Hồng' },
        { value: 'LV1', label: 'Lưu Văn Hoàng' },
        { value: 'LV2', label: 'Lưu Văn Bình' },
        { value: 'LV3', label: 'Lưu Văn Cường' },
        { value: 'LH1', label: 'Lưu Hữu Tâm' },
        { value: 'LH2', label: 'Lưu Hữu Đạt', disabled: true },
        { value: 'LH3', label: 'Lưu Hữu Nghĩa' },
        { value: 'LP1', label: 'Lưu Phương Anh' },
        { value: 'LP2', label: 'Lưu Phương Lan' },
        { value: 'LP3', label: 'Lưu Phương Linh' },
      ],
    },
    {
      label: 'Trương',
      options: [
        { value: 'TA1', label: 'Trương Anh Tú' },
        { value: 'TA2', label: 'Trương Anh Khoa' },
        { value: 'TA3', label: 'Trương Anh Minh', disabled: true },
        { value: 'TT1', label: 'Trương Thị Mai' },
        { value: 'TT2', label: 'Trương Thị Lan' },
        { value: 'TT3', label: 'Trương Thị Hồng' },
        { value: 'TV1', label: 'Trương Văn Hoàng' },
        { value: 'TV2', label: 'Trương Văn Bình', disabled: true },
        { value: 'TV3', label: 'Trương Văn Cường' },
        { value: 'TH1', label: 'Trương Hữu Tâm' },
        { value: 'TH2', label: 'Trương Hữu Đạt' },
        { value: 'TH3', label: 'Trương Hữu Nghĩa' },
        { value: 'TP1', label: 'Trương Phương Anh' },
        { value: 'TP2', label: 'Trương Phương Lan' },
        { value: 'TP3', label: 'Trương Phương Linh' },
      ],
    },
    {
      label: 'Vương',
      options: [
        { value: 'VA1', label: 'Vương Anh Tú', disabled: true },
        { value: 'VA2', label: 'Vương Anh Khoa' },
        { value: 'VA3', label: 'Vương Anh Minh' },
        { value: 'VT1', label: 'Vương Thị Mai' },
        { value: 'VT2', label: 'Vương Thị Lan' },
        { value: 'VT3', label: 'Vương Thị Hồng' },
        { value: 'VV1', label: 'Vương Văn Hoàng' },
        { value: 'VV2', label: 'Vương Văn Bình' },
        { value: 'VV3', label: 'Vương Văn Cường' },
        { value: 'VH1', label: 'Vương Hữu Tâm', disabled: true },
        { value: 'VH2', label: 'Vương Hữu Đạt' },
        { value: 'VH3', label: 'Vương Hữu Nghĩa' },
        { value: 'VP1', label: 'Vương Phương Anh' },
        { value: 'VP2', label: 'Vương Phương Lan' },
        { value: 'VP3', label: 'Vương Phương Linh' },
      ],
    },
    {
      label: 'Tạ',
      options: [
        { value: 'TA1', label: 'Tạ Anh Tú' },
        { value: 'TA2', label: 'Tạ Anh Khoa' },
        { value: 'TA3', label: 'Tạ Anh Minh' },
        { value: 'TT1', label: 'Tạ Thị Mai', disabled: true },
        { value: 'TT2', label: 'Tạ Thị Lan' },
        { value: 'TT3', label: 'Tạ Thị Hồng' },
        { value: 'TV1', label: 'Tạ Văn Hoàng' },
        { value: 'TV2', label: 'Tạ Văn Bình' },
        { value: 'TV3', label: 'Tạ Văn Cường', disabled: true },
        { value: 'TH1', label: 'Tạ Hữu Tâm' },
        { value: 'TH2', label: 'Tạ Hữu Đạt' },
        { value: 'TH3', label: 'Tạ Hữu Nghĩa' },
        { value: 'TP1', label: 'Tạ Phương Anh' },
        { value: 'TP2', label: 'Tạ Phương Lan' },
        { value: 'TP3', label: 'Tạ Phương Linh' },
      ],
    },
    {
      label: 'Dương',
      options: [
        { value: 'DA1', label: 'Dương Anh Tú', disabled: true },
        { value: 'DA2', label: 'Dương Anh Khoa' },
        { value: 'DA3', label: 'Dương Anh Minh' },
        { value: 'DT1', label: 'Dương Thị Mai' },
        { value: 'DT2', label: 'Dương Thị Lan' },
        { value: 'DT3', label: 'Dương Thị Hồng', disabled: true },
        { value: 'DV1', label: 'Dương Văn Hoàng' },
        { value: 'DV2', label: 'Dương Văn Bình' },
        { value: 'DV3', label: 'Dương Văn Cường' },
        { value: 'DH1', label: 'Dương Hữu Tâm' },
        { value: 'DH2', label: 'Dương Hữu Đạt' },
        { value: 'DH3', label: 'Dương Hữu Nghĩa' },
        { value: 'DP1', label: 'Dương Phương Anh' },
        { value: 'DP2', label: 'Dương Phương Lan' },
        { value: 'DP3', label: 'Dương Phương Linh' },
      ],
    },
    {
      label: 'Bành',
      options: [
        { value: 'BA1', label: 'Bành Anh Tú' },
        { value: 'BA2', label: 'Bành Anh Khoa', disabled: true },
        { value: 'BA3', label: 'Bành Anh Minh' },
        { value: 'BT1', label: 'Bành Thị Mai' },
        { value: 'BT2', label: 'Bành Thị Lan' },
        { value: 'BT3', label: 'Bành Thị Hồng' },
        { value: 'BV1', label: 'Bành Văn Hoàng' },
        { value: 'BV2', label: 'Bành Văn Bình' },
        { value: 'BV3', label: 'Bành Văn Cường' },
        { value: 'BH1', label: 'Bành Hữu Tâm' },
        { value: 'BH2', label: 'Bành Hữu Đạt', disabled: true },
        { value: 'BH3', label: 'Bành Hữu Nghĩa' },
        { value: 'BP1', label: 'Bành Phương Anh' },
        { value: 'BP2', label: 'Bành Phương Lan' },
        { value: 'BP3', label: 'Bành Phương Linh' },
      ],
    },


  ];
