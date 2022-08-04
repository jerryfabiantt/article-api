import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../articles/dto/create-comment.dto';
import {
  GetCommentsDto,
  GetCommentsWithReplyDto,
} from './dto/get-comments.dto';
import { ParamsIdRequest } from 'src/common/dto/param-id.dto';
import { Comment } from 'src/common/models/comment.model';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';

@Controller('comment')
@ApiTags('Comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:id/reply')
  getReplies(
    @Param('id') id: number,
    @Query() query: QueryFilterDto,
  ): Promise<GetCommentsDto> {
    return this.commentsService.getReplies(id, query);
  }
}
