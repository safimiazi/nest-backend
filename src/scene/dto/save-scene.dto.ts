import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}

export class SceneObjectDto {
  @IsString()
  instanceId: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;
}

export class SaveSceneDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SceneObjectDto)
  objects: SceneObjectDto[];
}
