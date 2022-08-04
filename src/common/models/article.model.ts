import {
  Column,
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleComments } from 'src/common/models/article-comments.model';
import { Comment } from 'src/common/models/comment.model';

@Table
export class Article extends Model {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ApiProperty({ required: true })
  @Column({ allowNull: false, type: DataType.STRING })
  nickName: string;

  @ApiProperty({ required: true })
  @Column({ allowNull: false, type: DataType.STRING })
  title: string;

  @ApiProperty({ required: true })
  @Column({ allowNull: false, type: DataType.STRING })
  content: string;

  @ApiProperty()
  @Column({ defaultValue: 0, allowNull: false, type: DataType.INTEGER })
  totalComments: number;

  @ApiProperty()
  @CreatedAt
  public createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  public updatedAt: Date;

  @BelongsToMany(() => Comment, {
    through: { model: () => ArticleComments },
    foreignKey: 'articleId',
  })
  comments: Comment[];
}
