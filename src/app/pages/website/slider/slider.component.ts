import { Component  } from '@angular/core';
import { PostCategoryService } from '../../../core/services/pos-category/post-category.service';
import { IPostCategory } from '../../../core/models/post-category.model';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent {

  postCategories: (IPostCategory | null)[] = [null, null, null, null];
  responsiveOptions: any[] | undefined;


  constructor(private postCateService: PostCategoryService) {}
  ngOnInit() {
    this.postCateService.getAllPostCategories().subscribe({
      next: (categories) => {
        // Sắp xếp danh mục theo created_at mới nhất và lấy 4 danh mục đầu tiên
        const sortedCategories = categories
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4);

        // Gán các danh mục đã sắp xếp vào mảng postCategories
        sortedCategories.forEach((category, index) => {
          this.postCategories[index] = category;
        });
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    });
  }
}
