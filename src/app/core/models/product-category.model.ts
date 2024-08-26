export interface CategoryResponse {
  message: string;
  result: boolean;
  data: Category[];
}
export interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
}

export interface Select2Option {
  value: number;
  label: string;
}
