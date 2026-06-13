import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({ email, passwordHash });
    const userId = (user._id as Types.ObjectId).toString();
    return { id: userId, email: user.email };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: (user._id as Types.ObjectId).toString() };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
