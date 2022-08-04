import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from 'src/common/models/article.model';
import { ArticleComments } from 'src/common/models/article-comments.model';
import { Comment } from 'src/common/models/comment.model';
import { ConfigService } from '@nestjs/config';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-article.dto';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';
import { CreateCommentDto } from 'src/articles/dto/create-comment.dto';
import { GetCommentsWithReplyDto } from 'src/comments/dto/get-comments.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
    @InjectModel(ArticleComments)
    private readonly articleCommentsModel: typeof ArticleComments,
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,

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
        exclude: ['updatedAt'],
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

  async createComment(
    articleId: number,
    commentInput: CreateCommentDto,
  ): Promise<Comment> {
    try {
      commentInput.articleId = articleId;
      commentInput.isReply = commentInput.parentCommentId ? true : false;
      const comment = await this.commentModel.create({
        ...commentInput,
      });
      this.updateArticleFields(comment);
      if (commentInput.parentCommentId) {
        this.increaseReplyCount(commentInput.parentCommentId);
      }
      return comment;
    } catch (error) {
      if (error.errors[0].type === 'unique violation') {
        throw new ConflictException(error.errors[0].message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
  async updateArticleFields(comment: Comment): Promise<boolean> {
    if (!comment.parentCommentId) {
      this.increaseCommentCount(comment.articleId);
      this.createArticleComments(comment.articleId, comment.id);
    }
    return true;
  }

  async increaseReplyCount(id: number): Promise<boolean> {
    this.commentModel.increment('totalReplies', {
      by: 1,
      where: {
        id,
      },
    });
    return true;
  }

  async getCommentsWithReplies(
    articleId: number,
    queryFilter: QueryFilterDto,
  ): Promise<GetCommentsWithReplyDto> {
    const query = `SELECT c.nickName AS commentNickName, c.content AS commentContent, c.articleId, c.id,c.createdAt, replies.replies
    FROM (SELECT * FROM comments WHERE parentCommentId IS NULL) AS c 
    LEFT JOIN (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', nickName, 'reply', content)) AS replies, articleId, parentCommentId FROM comments 
    WHERE parentCommentId IS NOT NULL GROUP BY parentCommentId  ORDER BY createdAt) AS replies ON c.articleId = replies.articleId AND replies.parentCommentId = c.id
    WHERE c.articleId=${articleId} ORDER BY c.createdAt LIMIT ${queryFilter.offset},${queryFilter.limit} `;
    const findQuery = this.commentModel.sequelize?.query(query);
    const countQuery = this.commentModel.count({
      where: {
        isReply: false,
        articleId,
      },
    });
    const [comments, totalCount] = await Promise.all([findQuery, countQuery]);

    return { comments: comments[0], totalCount };
  }
}
