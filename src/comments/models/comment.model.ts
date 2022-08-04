import {
  Column,
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/models/article.model';

@Table
export class Comment extends Model {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  nickName: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  content: string;

  @ApiProperty()
  @ForeignKey(() => Article)
  @Column({ allowNull: false })
  articleId: number;

  @BelongsTo(() => Article, 'articleId')
  article: Article;

  @ApiProperty()
  @ForeignKey(() => Comment)
  @Column({ allowNull: true })
  parentCommentId: number;

  @BelongsTo(() => Comment, {
    foreignKey: 'parentCommentId',
  })
  parentComment: Comment;

  @ApiProperty()
  @Column({ defaultValue: true })
  isReply: boolean;

  @ApiProperty()
  @Column({ defaultValue: 0 })
  totalReplies: number;

  @ApiProperty()
  @CreatedAt
  public createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  public updatedAt: Date;
}
