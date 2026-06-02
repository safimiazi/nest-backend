import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SceneController } from './scene.controller';
import { SceneService } from './scene.service';
import { SceneState, SceneStateSchema } from './schemas/scene-state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SceneState.name, schema: SceneStateSchema },
    ]),
    AuthModule,
  ],
  controllers: [SceneController],
  providers: [SceneService],
})
export class SceneModule {}
