import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  articleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentCommentId: number;

  @IsOptional()
  @IsBoolean()
  isReply?: boolean;
}
