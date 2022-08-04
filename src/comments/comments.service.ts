import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from 'src/articles/models/article.model';
import { Comment } from 'src/comments/models/comment.model';
import { ConfigService } from '@nestjs/config';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ArticlesService } from 'src/articles/articles.service';
import {
  GetCommentsDto,
  GetCommentsWithReplyDto,
} from './dto/get-comments.dto';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
    private articlesService: ArticlesService,
    private config: ConfigService,
  ) {}

  async createComment(commentInput: CreateCommentDto): Promise<Comment> {
    try {
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

  async increaseReplyCount(id: number): Promise<boolean> {
    this.commentModel.increment('totalReplies', {
      by: 1,
      where: {
        id,
      },
    });
    return true;
  }

  async updateArticleFields(comment: Comment): Promise<boolean> {
    if (!comment.parentCommentId) {
      this.articlesService.increaseCommentCount(comment.articleId);
      this.articlesService.createArticleComments(comment.articleId, comment.id);
    }
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

  async getCommentsWithOutReplies(
    articleId: number,
    queryFilter: QueryFilterDto,
  ): Promise<GetCommentsDto> {
    const findQuery = this.commentModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        isReply: false,
        articleId,
      },
      logging: console.log,
      order: [['createdAt', 'ASC']],
      limit: queryFilter.limit,
      offset: queryFilter.offset,
    });
    const countQuery = this.commentModel.count({
      where: {
        isReply: false,
        articleId,
      },
    });
    const [comments, totalCount] = await Promise.all([findQuery, countQuery]);

    return { comments, totalCount };
  }

  async getReplies(
    commentId: number,
    queryFilter: QueryFilterDto,
  ): Promise<GetCommentsDto> {
    const findQuery = this.commentModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        isReply: true,
        parentCommentId: commentId,
      },
      logging: console.log,
      order: [['createdAt', 'ASC']],
      limit: queryFilter.limit,
      offset: queryFilter.offset,
    });
    const countQuery = this.commentModel.count({
      where: {
        isReply: true,
        parentCommentId: commentId,
      },
    });
    const [comments, totalCount] = await Promise.all([findQuery, countQuery]);

    return { comments, totalCount };
  }
}
