import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { University } from 'src/universities/universities.entity';
import { Conversation, ConversationType } from 'src/chat/entities/conversation.entity';
import { ConversationParticipant } from 'src/chat/entities/conversation-participant.entity';
import { ElectionService } from 'src/election/election.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly electionService: ElectionService
  ) {}

 async createUser(createUserDto: CreateUserDto) {
  return await this.userRepository.manager.transaction(async (manager) => {
    
    const existingUser = await manager.findOne(User, {
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists!');
    }

    const universityDomain = this.findUniversityDomain(createUserDto.email);

    const university = await manager.findOne(University, {
      where: { domain: universityDomain },
    });

    if (!university) {
      throw new NotFoundException(
        "Your university could not be identified from your email...",
      );
    }

    let conversation = await manager.findOne(Conversation, {
      where: { university: { id: university.id } },
    });

    if (!conversation) {
      conversation = manager.create(Conversation, {
        type: ConversationType.UNIVERSITY,
        university,
      });
      conversation = await manager.save(conversation);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = manager.create(User, {
      ...createUserDto,
      password: hashedPassword,
      university,
    });

    const savedUser = await manager.save(newUser);

    const participant = manager.create(ConversationParticipant, {
      conversation,
      user: savedUser,
    });

    await manager.save(participant);

    const participantCount = await manager.count(ConversationParticipant, {
      where: {conversation: {id: conversation.id}}
    })
    if(participantCount === 1){
      await this.electionService.onFirstMemberJoined(conversation)
    }

    const { password, ...result } = savedUser;
    return result;
  });
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

  verifyJwt(token: string){
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      console.log("Error verifying JWT:", error);
      return null;
    }
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
