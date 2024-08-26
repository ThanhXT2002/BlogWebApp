export interface IBanner {
  key?: string;
  title: string;
  keyWord: string;
  height: number;
  width: number;
  effect: string;
  publish: boolean;
  arrow: boolean;
  navigation: string;
  autoplay: boolean;
  accept: boolean;
  animationDelay: number;
  animationSpeed: number;
  shortCode: string;
  album: IBannerImage[];
  created_at: string;
  updated_at: string;
}


export interface IBannerImage {
  imgDescription: string;
  url: string;
  newTab: boolean;
  name: string;
  alt: string;
  image: string;
}
