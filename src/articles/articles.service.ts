import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { ArticleComments } from './models/article-comments.model';
import { Comment } from 'src/comments/models/comment.model';
import { ConfigService } from '@nestjs/config';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-article.dto';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
    @InjectModel(ArticleComments)
    private readonly articleCommentsModel: typeof ArticleComments,
    private config: ConfigService,
  ) {}

  async createArticle(articleInput: CreateArticleDto): Promise<Article> {
    try {
      const article = await this.articleModel.create({
        ...articleInput,
      });
      return article;
    } catch (error) {
      if (error.errors[0].type === 'unique violation') {
        throw new ConflictException(error.errors[0].message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getArticles(query: QueryFilterDto): Promise<GetArticlesDto> {
    const findQuery = this.articleModel.findAll({
      attributes: {
        exclude: ['updatedAt', 'content'],
      },
      // logging: console.log,
      order: [['createdAt', 'ASC']],
      limit: query.limit,
      offset: query.offset,
    });
    const countQuery = this.articleModel.count();
    const [articles, totalCount] = await Promise.all([findQuery, countQuery]);
    return { articles, totalCount };
  }

  async getArticle(id: number): Promise<Article> {
    const article = await this.articleModel.findOne({
      attributes: {
        exclude: ['updatedAt', 'content'],
      },
      where: {
        id,
      },
    });
    return article;
  }

  async createArticleComments(
    articleId: number,
    commentId: number,
  ): Promise<ArticleComments> {
    const articleComment = await this.articleCommentsModel.create({
      commentId,
      articleId,
    });
    return articleComment;
  }

  async increaseCommentCount(id: number): Promise<boolean> {
    await this.articleModel.increment('totalComments', {
      by: 1,
      where: {
        id,
      },
    });
    return true;
  }
}
