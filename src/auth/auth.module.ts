import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import { GoogleStrategy } from './google.strategy';
import { MicrosoftStrategy } from './azure.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GithubStrategy } from './github.strategy';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRY,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    MicrosoftStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
