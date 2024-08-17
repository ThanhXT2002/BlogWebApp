
export interface IUser {
  key?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  birthday?: Date | string;
  image?: string;
  gender?: 'male' | 'female' | 'other' | string;
  description?: string;
  publish?: boolean;
  rememberToken?: string;
  role?:boolean;
  created_at?: string;
  updated_at?: string;
}
