import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type SceneStateDocument = SceneState & Document;

export interface SceneObjectPosition {
  x: number;
  y: number;
  z: number;
}

export interface SceneObjectEntry {
  instanceId: string;
  type: string;
  position: SceneObjectPosition;
}

const PositionSchema = new mongoose.Schema(
  { x: Number, y: Number, z: Number },
  { _id: false },
);

const SceneObjectSchema = new mongoose.Schema(
  { instanceId: String, type: String, position: PositionSchema },
  { _id: false },
);

@Schema()
export class SceneState {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ type: [SceneObjectSchema], required: true, default: [] })
  objects: SceneObjectEntry[];

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const SceneStateSchema = SchemaFactory.createForClass(SceneState);
