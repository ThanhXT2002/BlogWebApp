export interface IMenuItem {
  key: string;
  title: string;
  url?: string;
  icon?: string; // Thêm trường icon
  parentId?: string;
  children?: IMenuItem[];
  order: number;
}

export interface IMenu {
  key: string;
  name: string;
  publish: boolean;
  type: 'header' | 'footer' | 'sidebar';
  items: IMenuItem[];
}

