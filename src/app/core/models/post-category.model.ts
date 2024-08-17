export interface IPostCategory {
  key?: string;
  parent_id: string | null; // Trường này chọn key, nhưng có thể null
  title: string;
  slug: string;  // Chuyển từ title, ký tự không dấu
  description: string | null;
  content: string | null;
  album: string[] | null; // Là tập hợp của nhiều ảnh được mã hóa thành base64, có thể null
  image: string | null; // Là ảnh được mã hóa thành base64, có thể null
  publish: boolean;
  created_at: Date;
  updated_at: Date;
}
