import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SceneState, SceneStateDocument } from './schemas/scene-state.schema';
import { SceneObjectDto } from './dto/save-scene.dto';

@Injectable()
export class SceneService {
  constructor(
    @InjectModel(SceneState.name)
    private sceneStateModel: Model<SceneStateDocument>,
  ) {}

  async load(userId: string): Promise<{ objects: SceneObjectDto[] }> {
    const doc = await this.sceneStateModel.findOne({ userId }).exec();
    if (!doc) {
      return { objects: [] };
    }
    return { objects: doc.objects as unknown as SceneObjectDto[] };
  }

  async save(
    userId: string,
    objects: SceneObjectDto[],
  ): Promise<{ ok: boolean }> {
    await this.sceneStateModel
      .findOneAndUpdate(
        { userId },
        { $set: { objects, updatedAt: new Date() } },
        { upsert: true, new: true },
      )
      .exec();
    return { ok: true };
  }
}
