import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  RegistrationDto,
  EditRegistrationDto,
  LoginRegisteredUserDto,
} from 'src/dto/auth.dto';
import { GlobalResponseType } from 'src/utils/constant';
import { AuthService } from './auth.service';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string = new Date().getTime() + `-${file.originalname}`;
      cb(null, `${filename}`);
    },
  }),
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(FileInterceptor('file', storage))
  @Post('registration')
  async registerUser(
    @Body(ValidationPipe) RegistrationDto: RegistrationDto,
    @UploadedFile() file: Express.Multer.File,
  ): GlobalResponseType {
    return await this.authService.registerUser(RegistrationDto, file.filename);
  }

  @Get('registered_user')
  async registeredUser(): GlobalResponseType {
    return await this.authService.registeredUser();
  }

  @Patch('registered_user')
  async patchRegisteredUser(
    @Query('token') token: string,
    @Body(ValidationPipe) EditRegistrationDto: EditRegistrationDto,
  ): GlobalResponseType {
    return await this.authService.patchRegisteredUser(
      token,
      EditRegistrationDto,
    );
  }

  @Post('login')
  async postLogin(
    @Body(ValidationPipe) LoginRegisteredUserDto: LoginRegisteredUserDto,
  ): GlobalResponseType {
    return await this.authService.login(LoginRegisteredUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // return HttpStatus.OK;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req): GlobalResponseType {
    return this.authService.googleLogin(req);
  }

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftLogin(): Promise<any> {
    //return HttpStatus.OK;
  }

  @Get('microsoft/redirect')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftLoginCallback(@Req() req): GlobalResponseType {
    return this.authService.microsoftLogin(req);
  }
}
