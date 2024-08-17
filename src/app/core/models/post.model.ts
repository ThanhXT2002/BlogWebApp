export interface IPost{
    key?: string;
    post_category_id: string[];
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    album: string[] | null;
    image: string | null;
    publish: boolean;
    created_at: Date;
    updated_at: Date;
  }
