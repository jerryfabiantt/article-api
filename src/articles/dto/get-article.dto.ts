import { Article } from '../models/article.model';

export class GetArticlesDto {
  articles: Article[];
  totalCount: number;
}
