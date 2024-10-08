import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto,LoginDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { getCookieOptions } from 'src/config/CookieOptions';
import { ENV } from 'src/config/Env';
import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService, // Inject PrismaService
  ) {}

  async createUser(dto: CreateUserDto) {
    // console.log({dto})
    try {
      const isExist = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (isExist) {
        throw new HttpException('User already exist', 400);
      }
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: await bcrypt.hash(dto.password, 10),
        },
      });

      return user;
    } catch (error) {
      // Catch Prisma-specific errors or rethrow them
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException("Prisma Err",500);
      } else {
           throw new HttpException(error, error.status || 500);
      }
   
    }
  }

  async validateUser(email: string, password: string) {
   try {
     const user = await this.prisma.user.findUnique({
       where: {
         email,
       },
     });
     if (!user) {
       throw new NotFoundException('User not found');
     }
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       throw new HttpException('Invalid Password', 400);
     }
     return user;
   } catch (error) {
    throw new HttpException(error,error.status||500);
   }
  }

  async login(LoginDto: LoginDto, res: Response) {
    const { email, password } = LoginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }
    // Create payload (usually includes userId or email)
    const access_token_payload = {userId: user.id, email: user.email };
    const refresh_token_payload = {userId: user.id };

    // Generate JWT token
    const access_token = this.jwtService.sign(access_token_payload, {
      expiresIn: '1h',
      secret:ENV.jwtSecret,
    });
    const refresh_token = this.jwtService.sign(refresh_token_payload, {
      expiresIn: '7d',
      secret: ENV.refreshTokenSecret,
    });
    // Set JWT token in cookie
    // Set token in a cookie
    res.cookie('access_token', access_token, {
      ...getCookieOptions(60 * 60),
    });
    
    res.cookie('refresh_token', refresh_token, {
      ...getCookieOptions(60 * 60*7),
    });

    // Return token along with user information
    return {
      user: {
        id: user.id,
        email: user.email,
        // Any other user properties
      },
      access_token: access_token, // This is the JWT token
      refresh_token: refresh_token,
    };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async useDetails(req: Request) {
    if (!Number(req.user.userId)) {
      throw new HttpException('UserId not found', 404);
    }

 const user = await this.prisma.user.findUnique({
    where: {
      id: Number(req.user.userId),
    },
 })
    
  if (!user) {
    throw new HttpException('User not found', 404);
  }
  return user
  }
  
  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async updateUser(id: number, UpdateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...UpdateUserDto,
        password: UpdateUserDto.password
          ? await bcrypt.hash(UpdateUserDto.password, 10)
          : undefined,
      },
    });
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }

  async deleteMyAccount( req: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(req.user.userId),
      },
    })

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return {success:true,message:"Account deleted successfully"}
  }

  async logout(res: Response) {
  res.cookie('access_token', '', {
    ...getCookieOptions(0),
  });

  res.cookie('refresh_token', '', {
    ...getCookieOptions(0),
  });

    return { success: true, message: 'logged out successfully' };
  }
}
