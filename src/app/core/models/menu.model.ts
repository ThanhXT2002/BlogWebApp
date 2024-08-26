export interface IMenuItem {
  id: string;
  title: string;
  url?: string;
  icon?: string; // Thêm trường icon
  type: 'link' | 'dropdown' | 'megamenu';
  parentId?: string;
  children?: IMenuItem[];
  order: number;
  menuType: 'header' | 'footer' | 'sidebar';
}

export interface IMenu {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'sidebar';
  items: IMenuItem[];
}

// Giải thích chi tiết:

// 1. MenuItem:
//    - id: Định danh duy nhất cho mỗi mục menu
//    - title: Tiêu đề hiển thị của mục menu
//    - url: Đường dẫn của mục menu (tùy chọn, vì không phải mục nào cũng có link)
//    - icon: Icon của mục menu (tùy chọn)
//    - type: Loại của mục menu (link đơn giản, dropdown, hoặc megamenu)
//    - parentId: ID của mục menu cha (nếu có, dùng cho menu đa cấp)
//    - children: Mảng các mục menu con (dùng cho menu đa cấp)
//    - order: Thứ tự hiển thị của mục menu
//    - menuType: Loại menu mà mục này thuộc về (header, footer, sidebar)

// 2. Menu:
//    - id: Định danh duy nhất cho mỗi menu
//    - name: Tên của menu (ví dụ: "Main Navigation", "Footer Links")
//    - type: Loại của toàn bộ menu (header, footer, sidebar)
//    - items: Mảng các mục menu thuộc về menu này

// Giải thích về trùng lặp menuType:
// - Menu.type xác định loại của toàn bộ menu
// - MenuItem.menuType xác định loại menu mà mỗi mục cụ thể thuộc về
// Điều này cho phép:
// 1. Tái sử dụng các mục menu giữa các loại menu khác nhau
// 2. Lọc hoặc hiển thị các mục menu dựa trên loại menu cụ thể
// 3. Hỗ trợ trường hợp một mục menu có thể xuất hiện trong nhiều loại menu khác nhau
