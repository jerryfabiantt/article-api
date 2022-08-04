import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryFilterDto } from 'src/common/dto/query-filter.dto';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-article.dto';
import { Article } from './models/article.model';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(@Query() query: QueryFilterDto): Promise<GetArticlesDto> {
    return this.articlesService.getArticles(query);
  }

  @Post()
  createArticle(@Body() articleInput: CreateArticleDto): Promise<Article> {
    return this.articlesService.createArticle(articleInput);
  }
}
