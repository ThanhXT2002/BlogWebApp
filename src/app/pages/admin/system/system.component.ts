import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { TabViewModule } from 'primeng/tabview';
import { QuillModule } from 'ngx-quill';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ISystem } from '../../../core/models/system.model';
import { InputUploadComponent } from "../input-upload/input-upload.component";
import { SystemService } from '../../../core/services/system/system.service';
@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    TabViewModule,
    QuillModule,
    ReactiveFormsModule,
    InputUploadComponent
],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent {
    breadcrumbTitle:string="Cấu Hình Hệ Thống"
    systemForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      private systemService: SystemService,
      private toastr: ToastrService
    ) {
      this.systemForm = this.fb.group({
        companyName: ['', Validators.required],
        TrademarkName: ['', Validators.required],
        slogan: [''],
        logo: [''],
        favicon: [''],
        iamge: [''],
        copyright: [''],
        status: ['open'],
        CompanyAddress: [''],
        transactionOffice: [''],
        hotline: [''],
        techniqueHotline: [''],
        businessHotline: [''],
        fax: [''],
        email: ['', [Validators.email]],
        taxCode: [''],
        dunsCode: [''],
        website: [''],
        map: [''],
        shotDescription: [''],
        titleSeo: [''],
        keySeo: [''],
        imageSeo: [''],
        descriptionSeo: ['']
      });
    }

    ngOnInit() {
      this.loadSystemInfo();
    }

    loadSystemInfo() {
      this.systemService.getSystemInfo().subscribe(
        (systemInfo) => {
          if (systemInfo) {
            this.systemForm.patchValue(systemInfo);
          }
        },
        (error) => {
          console.error('Lỗi khi tải thông tin hệ thống:', error);
          this.toastr.error('Không thể tải thông tin hệ thống')
        }
      );
    }

    onSubmit() {
      if (this.systemForm.valid) {
        const systemInfo: ISystem = this.systemForm.value;
        this.systemService.saveSystemInfo(systemInfo).subscribe(
          () => {
            this.toastr.success('Lưu thông tin hệ thống thành công')
          },
          (error) => {
            console.error('Lỗi khi lưu thông tin hệ thống:', error);
            this.toastr.error('Lỗi khi lưu thông tin hệ thống')
          }
        );
      } else {
        this.toastr.warning('Vui lòng điền đẩy đủ thông tin bắt buộc')
      }
    }

    onImageUrlChange(controlName: string, url: string) {
      this.systemForm.get(controlName)?.setValue(url);
    }

}
