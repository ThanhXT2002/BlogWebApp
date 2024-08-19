export interface IComment {
  key?: string | null;
  post_id: string;
  user_id: string;
  user_name: string;
  user_image?: string;
  content: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
