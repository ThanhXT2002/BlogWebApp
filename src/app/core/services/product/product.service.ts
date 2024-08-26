import { Injectable } from '@angular/core';
import { Constant } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../models/product-category.model';

import { Product } from '../../models/product.model';



@Injectable({
  providedIn: 'root'
})
// Service class để xử lý các thao tác liên quan đến sản phẩm
export class ProductService {

  // Constructor của service
  // @param http: HttpClient - Được inject tự động bởi Angular's DI system
  constructor(private http: HttpClient) { }

  // Phương thức để lấy danh sách các danh mục
  // @returns Observable<any> - Trả về một Observable chứa dữ liệu danh mục
  // getCategory(){
  //   // Gửi HTTP GET request đến API endpoint để lấy danh sách danh mục
  //   return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_ALL_CATEGORY)
  // }

  getCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_CATEGORY);
  }



  // Phương thức để lấy danh sách tất cả sản phẩm
  // @returns Observable<any> - Trả về một Observable chứa dữ liệu sản phẩm
  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT);
  }
  // getProducts(){
  //   // Gửi HTTP GET request đến API endpoint để lấy danh sách sản phẩm
  //   return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT)
  // }

  // Phương thức để lưu (tạo mới) một sản phẩm
  // @param obj: any - Đối tượng chứa thông tin sản phẩm cần tạo
  // @returns Observable<any> - Trả về một Observable chứa kết quả của thao tác tạo
  saveProduct(obj: any){
    // Gửi HTTP POST request với dữ liệu sản phẩm trong body để tạo sản phẩm mới
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.CREATE_PRODUCT, obj);
  }

  // Phương thức để cập nhật thông tin một sản phẩm
  // @param obj: any - Đối tượng chứa thông tin sản phẩm cần cập nhật
  // @returns Observable<any> - Trả về một Observable chứa kết quả của thao tác cập nhật
  updateProduct(obj: any){
    // Gửi HTTP POST request với dữ liệu sản phẩm trong body để cập nhật sản phẩm
    // Lưu ý: Thông thường, nên sử dụng HTTP PUT hoặc PATCH cho thao tác cập nhật
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.UPDATE_PRODUCT, obj);
  }

  // Phương thức để xóa một sản phẩm
  // @param id: any - ID của sản phẩm cần xóa
  // @returns Observable<any> - Trả về một Observable chứa kết quả của thao tác xóa
  deleteProduct(id: any){
    // Gửi HTTP GET request để xóa sản phẩm với ID được chỉ định
    // Lưu ý: Theo chuẩn RESTful, nên sử dụng HTTP DELETE method thay vì GET cho thao tác xóa
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.DELETE_PRODUCT + id);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_PRODUCT_BY_ID+id);
  }
}
