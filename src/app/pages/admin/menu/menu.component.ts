import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { TableModule } from 'primeng/table';
import { IMenu } from '../../../core/models/menu.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    TableModule,
    CommonModule,
    FormsModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  menuForm:FormGroup;
  menus:IMenu[] = [];
  sidebarVisible:boolean = false;
  editingMenuKey: string | null = null;

  constructor(
    private menuService:MenuService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ){
    this.menuForm = this.fb.group({
      name:['',Validators.required ],
      type: ['header'],
      publish: [true]
      // items: IMenuItem[];
    });

  }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe({
      next: (menus) => {
        this.menus = menus;
      },
      error: (error) => {
        this.toastr.error('Lỗi khi tải danh sách menu');
        console.error(error);
      }
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;
      if (this.editingMenuKey) {
        this.updateMenu(this.editingMenuKey, menuData);
      } else {
        this.createMenu(menuData);
      }
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin');
    }
  }

  createMenu(menuData: Omit<IMenu, 'key'>) {
    this.menuService.createMenu(menuData).subscribe({
      next: () => {
        this.toastr.success('Tạo menu thành công');
        this.loadMenus();
        this.resetForm();

      },
      error: (error) => {
        this.toastr.error('Lỗi khi tạo menu');
        console.error(error);
      }
    });
  }

  updateMenu(key: string, menuData: Partial<IMenu>) {
    this.menuService.updateMenu(key, menuData).subscribe({
      next: () => {
        this.toastr.success('Cập nhật menu thành công');
        this.loadMenus();
        this.resetForm();
      },
      error: (error) => {
        this.toastr.error('Lỗi khi cập nhật menu');
        console.error(error);
      }
    });
  }

  addNewMenu() {
    this.editingMenuKey = null;
    this.resetForm();
    this.sidebarVisible = true;
  }

  resetForm() {
    this.menuForm.reset({
      name: '',
      type: 'header',
      publish: true
    });
    this.sidebarVisible = false;
    this.editingMenuKey = null;
  }

  updateMenuPublish(menu: IMenu) {
    this.menuService.updateMenu(menu.key!, { publish: menu.publish }).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái menu thành công');
      },
      error: (error) => {
        this.toastr.error('Lỗi khi cập nhật trạng thái menu');
        console.error(error);
        menu.publish = !menu.publish; // Hoàn tác thay đổi nếu cập nhật thất bại
      }
    });
  }

  editMenu(menuKey: string) {
    const menu = this.menus.find(m => m.key === menuKey);
    if (menu) {
      this.editingMenuKey = menuKey;
      this.menuForm.patchValue({
        name: menu.name,
        type: menu.type,
        publish: menu.publish
      });
      this.sidebarVisible = true;
    }
  }

  editMenuItem(menu: IMenu) {
    this.router.navigate(['/admin/menu-items', menu.key], {
      queryParams: { menuName: menu.name }
    });
  }

  deleteMenu(menuKey: string) {
    if (confirm('Bạn có chắc chắn muốn xóa menu này?')) {
      this.menuService.deleteMenu(menuKey).subscribe({
        next: () => {
          this.toastr.success('Xóa menu thành công');
          this.loadMenus();
        },
        error: (error) => {
          this.toastr.error('Lỗi khi xóa menu');
          console.error(error);
        }
      });
    }
  }

}
