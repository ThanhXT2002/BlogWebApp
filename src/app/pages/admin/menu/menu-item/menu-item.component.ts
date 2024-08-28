import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbComponent } from "../../layout/breadcrumb/breadcrumb.component";
import { IMenuItem } from '../../../../core/models/menu.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../../core/services/menu/menu.service';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    RouterModule

  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent implements OnInit{
  breadcrumbTitle:string="Sắp xếp item";
  titleCard:string="";
  menuItems: IMenuItem[] = [];
  menuKey: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private router:Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.menuKey = params.get('menuKey');
      if (this.menuKey) {
        this.loadMenuItems(this.menuKey);
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      const menuName = queryParams.get('menuName');
      if (menuName) {
        this.breadcrumbTitle = `Sắp xếp item '${menuName}'`;
        this.titleCard = `${menuName}`;
      }
    });
  }

  editItemMenu() {
    if (this.menuKey) {
      this.router.navigate(['/admin/form-menu', this.menuKey], {
        queryParams: { menuName: this.titleCard }
      });
    }
  }

  loadMenuItems(menuKey: string) {
    this.menuService.getMenuItems(menuKey).subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (error) => {
        console.error('Error loading menu items', error);
        // Xử lý lỗi ở đây (ví dụ: hiển thị thông báo lỗi)
      }
    });
  }



}
