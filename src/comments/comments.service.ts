import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from 'src/common/models/article.model';
import { Comment } from 'src/common/models/comment.model';
import { ConfigService } from '@nestjs/config';
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

    private config: ConfigService,
  ) {}

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
