import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  GetCommentsDto,
  GetCommentsWithReplyDto,
} from './dto/get-comments.dto';
import { ParamsIdRequest } from 'src/common/dto/param-id.dto';
import { Comment } from './models/comment.model';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:articleId/with-replies')
  getCommentsWithReply(
    @Param('articleId') id: number,
    @Query() query: QueryFilterDto,
  ): Promise<GetCommentsWithReplyDto> {
    return this.commentsService.getCommentsWithReplies(id, query);
  }

  @Get('/:articleId/without-replies')
  getCommentsWithoutReply(
    @Param('articleId') id: number,
    @Query() query: QueryFilterDto,
  ): Promise<GetCommentsDto> {
    return this.commentsService.getCommentsWithOutReplies(id, query);
  }

  @Get('/:id/replies')
  getReplies(
    @Param('id') id: number,
    @Query() query: QueryFilterDto,
  ): Promise<GetCommentsDto> {
    return this.commentsService.getReplies(id, query);
  }

  @Post()
  createArticle(@Body() commentInput: CreateCommentDto): Promise<Comment> {
    return this.commentsService.createComment(commentInput);
  }
}
