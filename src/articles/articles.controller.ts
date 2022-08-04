import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from 'src/articles/dto/create-comment.dto';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-article.dto';
import { Article } from 'src/common/models/article.model';
import { Comment } from 'src/common/models/comment.model';
import { GetCommentsWithReplyDto } from 'src/comments/dto/get-comments.dto';

@Controller('article')
@ApiTags('Article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(@Query() query: QueryFilterDto): Promise<GetArticlesDto> {
    return this.articlesService.getArticles(query);
  }

  @Get(':id')
  getArticleById(@Param('id') id: number): Promise<Article> {
    return this.articlesService.getArticle(id);
  }

  @Post()
  createArticle(@Body() articleInput: CreateArticleDto): Promise<Article> {
    return this.articlesService.createArticle(articleInput);
  }

  @Post(':id/comment')
  createComment(
    @Param('id') id: number,
    @Body() commentInput: CreateCommentDto,
  ): Promise<Comment> {
    return this.articlesService.createComment(id, commentInput);
  }

  @Get('/:id/comment')
  getCommentsWithReply(
    @Param('id') id: number,
    @Query() query: QueryFilterDto,
  ): Promise<GetCommentsWithReplyDto> {
    return this.articlesService.getCommentsWithReplies(id, query);
  }
}
