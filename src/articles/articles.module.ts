import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Article } from 'src/common/models/article.model';
import { ArticleComments } from '../common/models/article-comments.model';
import { Comment } from 'src/common/models/comment.model';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Article, ArticleComments, Comment]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
