export type NewsSportFilter = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

export interface NewsArticle {
  id: string;
  sport: Exclude<NewsSportFilter, 'all'>;
  title: string;
  description: string;
  image: string;
  author: string;
  category: string;
  date: string;
  url: string;
}

