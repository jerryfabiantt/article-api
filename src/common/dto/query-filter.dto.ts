import { IsDefined, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryFilterDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  offset: number;
}
