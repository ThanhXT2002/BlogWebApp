import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBanner } from '../../../core/models/banner.model';
import { BannerService } from '../../../core/services/banner/banner.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    InputSwitchModule
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  banners: IBanner[] = [];

  constructor(
    private bannerService: BannerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.bannerService.getAllBanners().subscribe({
      next: (banners) => {
        this.banners = banners;
      },
      error: (error) => {
        this.toastr.error('Error loading banners');
        console.error(error);
      }
    });
  }

  addNewBanner() {
    this.router.navigate(['/admin/form-banner']);
  }

  editBanner(key: string | undefined) {
    if (key) {
      this.router.navigate(['/admin/form-banner/', key]);
    }
  }

  deleteBanner(key: string | undefined) {
    if (key && confirm('Are you sure you want to delete this banner?')) {
      this.bannerService.delete(key).subscribe({
        next: () => {
          this.toastr.success('Banner deleted successfully');
          this.loadBanners();
        },
        error: (error) => {
          this.toastr.error('Error deleting banner');
          console.error(error);
        }
      });
    }
  }

  updateBannerPublish(banner :IBanner){
    this.bannerService.update(banner.key!, { publish: banner.publish }).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái banner thành công');
      },
      error: (error) => {
        console.error('Error updating banner publish', error);
        this.toastr.error('Không thể cập nhật trạng thái banner');
        // Revert the change in the local array if the API call fails
        banner.publish = !banner.publish;
      }
    });
  }
}
