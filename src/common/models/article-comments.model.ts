import {
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Article } from 'src/common/models/article.model';
import { Comment } from 'src/common/models/comment.model';

@Table
export class ArticleComments extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Article)
  @Column
  articleId: number;

  @ForeignKey(() => Comment)
  @Column
  commentId: string;
}
