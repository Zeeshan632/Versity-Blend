import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { University } from 'src/universities/universities.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists!');
    }

    const universityDomain = this.findUniversityDomain(createUserDto.email);

    const university = await this.universityRepository.findOne({
      where: { domain: universityDomain },
    });

    if (!university) {
      throw new NotFoundException(
        "Your university could not be identified from your email, please make sure you are using your university email correct. If it still doesn't work, please talk with our help desk to register your university in our database!",
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      university: university,
    });

    const createdUser = await this.userRepository.save(newUser);

    const { password, ...results } = createdUser;

    return results;
  }

  private findUniversityDomain(email: string) {
    return email.split('@')[1];
  }

  async login(loginUserDto: LoginUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!userExists) {
      throw new NotFoundException('User with this email does not exist!');
    }

    const comparePassword = await bcrypt.compare(
      loginUserDto.password,
      userExists.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Incorrect Password!');
    }

    const tokens = this.generateTokens(userExists);

    const { password, ...userToBeReturned } = userExists;

    return { ...userToBeReturned, ...tokens };
  }

  private generateTokens(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }

  private generateRefreshToken(user: User) {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });
  }
}
