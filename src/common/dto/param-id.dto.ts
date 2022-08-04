import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ParamsIdRequest {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.id)
  id: number;
}
