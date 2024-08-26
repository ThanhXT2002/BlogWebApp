import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from "../../layout/breadcrumb/breadcrumb.component";
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../core/services/product/product.service';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillConfigModule } from 'ngx-quill/config';
import { Select2Module  } from 'ng-select2-component';
import { CategoryResponse, Select2Option } from '../../../../core/models/product-category.model';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    QuillModule,
    ReactiveFormsModule,
    Select2Module,
    NgxDropzoneModule
  ],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss'
})
export class FormProductComponent implements OnInit {
  breadcrumbTitle: string = 'Thêm Mới Sản Phẩm';
  productsList: any[] = [];

  productForm: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;
  imagePreview: string | null = null;
  //select 2
  categoryList: Select2Option[] = [];
  overlay: boolean = false;
  //frop img
  Files: File[] = [];

  constructor(
    private productSrv: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.productForm = this.fb.group({
      ProductId: [0],
      ProductSku: [this.generateSku()],
      ProductName: ['', Validators.required],
      ProductPrice: [''],
      ProductShortName: [''],
      ProductDescription: [''],
      CreatedDate: [new Date()],
      DeliveryTimeSpan: [null],
      CategoryId: [0],
      ProductImageUrl: [''],
    });
  }

  ngOnInit(): void {
    let productId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams.subscribe(params => {
      if (params['mode'] == 'edit') {
        // Cập nhật tiêu đề
        this.breadcrumbTitle = 'Chỉnh Sửa Thông tin sản phẩm';
        this.loadProductData(productId);
      }
    });
    this.getAllCategory();
  }

  getAllCategory() {
    this.productSrv.getCategory().subscribe({
      next: (response: CategoryResponse) => {
        if (response.result && Array.isArray(response.data)) {
          this.categoryList = response.data.map(cat => ({
            value: cat.categoryId,
            label: cat.categoryName
          }));
        } else {
          console.error('Unexpected data structure:', response);
          this.categoryList = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
        this.categoryList = [];
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      // Kiểm tra xem đây là tạo mới hay cập nhật
      if (productData.ProductId === 0) {
        this.create(productData);
      } else {
        this.update();
      }
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
    }
  }


  create(productData: any) {
    // Đảm bảo rằng tất cả dữ liệu cần thiết đã được cung cấp
    if (!productData.ProductName || !productData.ProductImageUrl) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Chuẩn bị dữ liệu để gửi
    const newProduct = {
      ...productData,
      ProductId: 0, // Đặt là 0 để server tạo ID mới
      CreatedDate: new Date().toISOString(), // Đảm bảo ngày tạo là ngày hiện tại
      ProductSku: this.generateSku(), // Sử dụng hàm generateSku để tạo SKU
      ProductImageUrl: this.productForm.get('ProductImageUrl')?.value, // Ảnh đại diện đã được chuyển thành base64
      ProductDescription: this.productForm.get('ProductDescription')?.value // Danh sách ảnh đã được chuyển thành JSON string
    };

    // Gọi service để tạo sản phẩm mới
    this.productSrv.saveProduct(newProduct).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.toastr.success('Thêm sản phẩm mới thành công!');
          // Reset form sau khi thêm thành công
          this.resetForm();
        } else {
          this.toastr.error('Có lỗi xảy ra khi thêm sản phẩm.');
        }
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.toastr.error('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.');
      }
    });
  }

  // Cập nhật phương thức resetForm
  resetForm() {
    this.productForm.reset({
      ProductId: 0,
      ProductSku: this.generateSku(),
      CreatedDate: new Date(),
      CategoryId: 0
    });
    this.imagePreview = null;
    this.Files = [];
    this.updateProductDescription(); // Cập nhật lại ProductDescription khi reset form
  }


  update() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productSrv.updateProduct(productData).subscribe({
        next: (response: any) => {
          if (response.result) {
            this.toastr.success('Cập nhật sản phẩm thành công!');
            this.router.navigate(['/admin/product']);
          } else {
            this.toastr.error('Có lỗi xảy ra khi cập nhật sản phẩm.');
          }
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastr.error('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại sau.');
        }
      });
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // img avata

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileToBase64(file).then(
        (base64String: string) => {
          this.imagePreview = base64String;
          this.productForm.patchValue({
            ProductImageUrl: base64String
          });
        }
      );
    }
  }

  // Tạo ký tự SKU product tự động
  generateSku(): string {
    const now = new Date();
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `TXT-${seconds}${hours}${minutes}${day}${month}${year}`;
  }


  // drop image:
  onSelect(event: any) {
    this.Files.push(...event.addedFiles);
    this.updateProductDescription();
  }

  onRemove(file: File) {
    this.Files = this.Files.filter(f => f !== file);
    this.updateProductDescription();
  }

  updateProductDescription() {
    const imagePromises = this.Files.map(file => this.fileToBase64(file));
    Promise.all(imagePromises).then(base64Images => {
      const imagesJson = JSON.stringify(base64Images);
      this.productForm.patchValue({
        ProductDescription: imagesJson
      });
    });
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  loadProductData(productId: number) {
    this.productSrv.getProductById(productId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          const product = response.data;
          // Cập nhật form với dữ liệu sản phẩm
          this.productForm.patchValue({
            ProductId: product.productId,
            ProductSku: product.productSku,
            ProductName: product.productName,
            ProductPrice: product.productPrice,
            ProductShortName: product.productShortName,
            ProductDescription: product.productDescription,
            CreatedDate: new Date(product.createdDate),
            DeliveryTimeSpan: product.deliveryTimeSpan,
            CategoryId: product.categoryId,
            ProductImageUrl: product.productImageUrl
          });
          // Cập nhật preview ảnh đại diện
          this.imagePreview = product.productImageUrl;

          // Xử lý ProductDescription nếu nó chứa danh sách ảnh dạng base64
          if (product.productDescription) {
            try {
              const base64Images = JSON.parse(product.productDescription);
              this.Files = base64Images.map((base64: string, index: number) => {
                // Tạo File object từ base64 string
                const byteString = atob(base64.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                return new File([ab], `image${index}.jpg`, { type: 'image/jpeg' });
              });
            } catch (error) {
              console.error('Error parsing ProductDescription:', error);
            }
          }
        } else {
          this.toastr.error('Không tìm thấy thông tin sản phẩm.');
        }
      },
      error: (error) => {
        console.error('Error loading product data:', error);
        this.toastr.error('Có lỗi xảy ra khi tải thông tin sản phẩm.');
      }
    });
  }


}
