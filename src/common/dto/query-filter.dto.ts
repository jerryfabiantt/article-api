import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryFilterDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit: number;

  @ApiProperty()
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(0)
  offset: number;
}
