import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EditRegistrationDto,
  LoginRegisteredUserDto,
  RegistrationDto,
} from 'src/dto/auth.dto';
import { UserEntity } from 'src/entities/user.entity';
import {
  DtoErrorMessage,
  GlobalResponseType,
  jwtToken,
  ResponseData,
  Validation_Message,
} from 'src/utils/constant';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private JwtService: JwtService,
  ) {}

  async registerUser(
    credentials: RegistrationDto,
    profile_photo: string,
  ): GlobalResponseType {
    try {
      const emailValidate = await this.userRepository.findOne({
        where: {
          email: credentials.email,
        },
      });

      if (emailValidate) {
        throw new NotFoundException(Validation_Message.email_registered);
      }
      const user = new UserEntity();

      user.name = credentials.name;
      user.age = credentials.age;
      user.gender = credentials.gender;
      user.email = credentials.email;
      user.city = credentials.city;
      user.state = credentials.state;
      user.hobbies = credentials.hobbies;
      user.photo = profile_photo;

      if (credentials.confirm_password !== credentials.password) {
        throw new UnauthorizedException(DtoErrorMessage.invalid_password);
      }
      user.password = await bcrypt.hash(credentials.password, 10);
      await user.save();

      const jwtGenereatedToken: jwtToken = {
        id: user.id,
        email: user.email,
      };

      const accessToken = await this.JwtService.sign(jwtGenereatedToken);

      return ResponseData({
        user: user,
        accessToken: accessToken,
      });
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registeredUser(): GlobalResponseType {
    try {
      const registeredData = await this.userRepository
        .createQueryBuilder('r')
        .getMany();
      return ResponseData(registeredData);
    } catch (err) {}
  }

  async patchRegisteredUser(
    token: string,
    credentials: EditRegistrationDto,
  ): GlobalResponseType {
    try {
      const decodedJwtAccessToken = this.JwtService.decode(token);

      const searchUser = await this.userRepository.findOne({
        id: decodedJwtAccessToken['id'],
      });

      searchUser.city = credentials.city;
      searchUser.state = credentials.state;
      searchUser.hobbies = credentials.hobbies;

      await searchUser.save();

      return ResponseData(
        { updatedUser: searchUser },
        'The user is successfully updated',
      );
    } catch (err) {}
  }

  async login(credentials: LoginRegisteredUserDto): GlobalResponseType {
    try {
      const { password } = credentials;

      const searchUser = await this.userRepository.findOne({
        email: credentials.email,
      });

      if (!searchUser) {
        throw new UnauthorizedException('Email is wrong');
      }

      const isValid = await searchUser.validatePassword(password);

      if (!isValid) {
        throw new UnauthorizedException('Password is not matched');
      }

      const jwtGenereatedToken: jwtToken = {
        id: searchUser.id,
        email: searchUser.email,
      };

      const accessToken = await this.JwtService.sign(jwtGenereatedToken);

      return ResponseData(
        {
          user: searchUser,
          accessToken: accessToken,
        },
        'Successfully Login!',
      );
    } catch (err) {}
  }
}
