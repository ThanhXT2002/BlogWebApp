import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category, CategoryResponse } from '../../models/product-category.model';
import { Constant } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient) { }

  getCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_CATEGORY);
  }

  createCategory(obj: any){
    // Gửi HTTP POST request với dữ liệu sản phẩm trong body để tạo sản phẩm mới
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.CREATE_NEW_CATEGORY, obj);
  }

  deleteCategory(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(Constant.API_END_POINT + Constant.METHODS.DELETE_CATEGORY + id);
  }

  getHierarchicalCategories(): Observable<any[]> {
    return this.getCategory().pipe(
      map(response => {
        if (response.result && Array.isArray(response.data)) {
          return this.buildHierarchy(response.data);
        }
        return [];
      })
    );
  }

  private buildHierarchy(categories: any[]): any[] {
    const hierarchy: any[] = [];
    const lookup: { [key: number]: any } = {};

    categories.forEach(category => {
      const { categoryId, categoryName, parentCategoryId } = category;
      const item = {
        value: categoryId,
        label: categoryName,
        children: [],
        level: 0
      };
      lookup[categoryId] = item;
      if (!parentCategoryId) {
        hierarchy.push(item);
      }
    });

    categories.forEach(category => {
      const { categoryId, parentCategoryId } = category;
      if (parentCategoryId && lookup[parentCategoryId]) {
        lookup[parentCategoryId].children.push(lookup[categoryId]);
        lookup[categoryId].level = lookup[parentCategoryId].level + 1;
      }
    });

    return this.flattenHierarchy(hierarchy);
  }

  private flattenHierarchy(items: any[], prefix = ''): any[] {
    let result: any[] = [];
    items.forEach(item => {
      const label = prefix + item.label;
      result.push({
        value: item.value,
        label: label,
      });
      if (item.children.length > 0) {
        result = result.concat(this.flattenHierarchy(item.children, prefix + '----'));
      }
    });
    return result;
  }
  // kiểm tra xem một danh mục có danh mục con hay không:
  hasChildCategories(categories: Category[], parentId: number): boolean {
    return categories.some(cat => cat.parentCategoryId === parentId);
  }


}
