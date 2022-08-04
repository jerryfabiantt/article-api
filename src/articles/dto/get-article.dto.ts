import { Article } from 'src/common/models/article.model';

export class GetArticlesDto {
  articles: Article[];
  totalCount: number;
}
