import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SceneService } from './scene.service';
import { SaveSceneDto } from './dto/save-scene.dto';

@Controller('scene')
@UseGuards(JwtAuthGuard)
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @Get('load')
  async load(@Request() req: ExpressRequest & { user: { userId: string } }) {
    const userId: string = req.user.userId;
    return this.sceneService.load(userId);
  }

  @Post('save')
  @HttpCode(HttpStatus.OK)
  async save(
    @Body() dto: SaveSceneDto,
    @Request() req: ExpressRequest & { user: { userId: string } },
  ) {
    const userId: string = req.user.userId;
    return this.sceneService.save(userId, dto.objects);
  }
}
