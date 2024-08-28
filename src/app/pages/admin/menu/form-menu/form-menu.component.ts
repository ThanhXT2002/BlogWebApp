import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { MenuService } from '../../../../core/services/menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMenuItem } from '../../../../core/models/menu.model';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-menu',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-menu.component.html',
  styleUrl: './form-menu.component.scss'
})
export class FormMenuComponent {
  breadcrumbTitle:string="Cập nhật Item Menu"

  // // Khởi tạo một mảng để lưu các item menu
  // menuItems: IMenuItem[] = [];

  menuForm: FormGroup;

  menuKey: string | null = null;
  menuName: string = '';

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.menuForm = this.fb.group({
      items: this.fb.array([])
    });
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.menuKey = params.get('menuKey');
      if (this.menuKey) {
        this.loadMenuItems(this.menuKey);
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      this.menuName = queryParams.get('menuName') || '';
      this.breadcrumbTitle = `Cập nhật Item Menu '${this.menuName}'`;
    });
  }

  get menuItems() {
    return this.menuForm.get('items') as FormArray;
  }

  loadMenuItems(menuKey: string) {
    this.menuService.getMenuItems(menuKey).subscribe({
      next: (items) => {
        this.menuItems.clear(); // Xóa tất cả các item hiện tại
        items.forEach((item, index) => {
          this.menuItems.push(this.fb.group({
            title: [item.title],
            url: [item.url],
            icon: [item.icon],
            order: [index]
          }));
        });
      },
      error: (error) => {
        console.error('Error loading menu items', error);
        this.toastr.error('Không thể tải menu items');
      }
    });
  }

  // Hàm để thêm một item mới
  addItem() {
    const newItem = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      url: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      icon: [''],
      order: [this.menuItems.length]
    });
    this.menuItems.push(newItem);
  }


  // Hàm để xóa một item
  deleteItem(index: number) {
    this.menuItems.removeAt(index);
    // Cập nhật lại order cho các item còn lại
    this.menuItems.controls.forEach((control, i) => {
      control.get('order')?.setValue(i);
    });
  }

  saveMenuItems() {
    if (this.menuForm.valid) {
      if (!this.menuKey) {
        this.toastr.error('Không tìm thấy menu key');
        return;
      }

      const menuItems: IMenuItem[] = this.menuForm.value.items;
      menuItems.forEach((item, index) => {
        item.order = index;
      });

      this.menuService.updateMenuItems(this.menuKey, menuItems).subscribe({
        next: () => {
          this.toastr.success('Cập nhật menu items thành công');
          this.router.navigate(['/admin/menu']);
        },
        error: (error) => {
          console.error('Error updating menu items', error);
          this.toastr.error('Không thể cập nhật menu items');
        }
      });
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin và đúng định dạng');
    }
  }
}
