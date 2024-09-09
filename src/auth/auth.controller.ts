// src/auth/auth.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto/user.dto';
import { CustomParseIntPipe } from './pipes/params.pipe';

import type {Response, Request } from 'express';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/Auth.guard';
import { RolesGuard } from './guards/Roles.guard';
import { Roles } from './pipes/Roles.pipe';
import { Role } from '../types/enums';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', links: { self: { operationId: 'createUser' } } })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
  @Post('login')
  login(@Body() LoginDto: LoginDto, @Res({ passthrough: true }) res:Response) {
    return this.authService.login(LoginDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get user details.', type: CreateUserDto })
  @Get('me')
  me(@Req() req: Request) {
    return this.authService.useDetails(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'User ID', required: true })
  @Patch('update/:id')
  update(@Param('id', CustomParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Get user details By ID.', type: CreateUserDto })
  @Get('user/:id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    return this.authService.getUserById(+id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'email', type: String, description: 'User Email', required: true })
  @ApiResponse({ status: 200, description: 'Get user details By Email.', type: CreateUserDto })
  @Get('user/email/:email')
  findByEmail(@Param('email') email: string) {
    return this.authService.getUserByEmail(email);
  }

  @ApiResponse({ status: 200, description: 'Get all users.', isArray: true, type: CreateUserDto })
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.authService.getAllUsers();
  }

  @ApiParam({ name: 'id', type: Number, description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'User Deleted Successfully.' })
  @Get('user/delete/:id')
  delete(@Param('id', CustomParseIntPipe) id: number) {
    return this.authService.deleteUser(+id);
  }
  @Get('logout')
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  logout(@Res({ passthrough: true }) rep:Response) {
    return this.authService.logout(rep);
  }
  @Get('deleteMyAccount')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Your account Deleted Successfully.' })
  deleteMyAccount(@Res({ passthrough: true }) req: Request) {
    return this.authService.deleteMyAccount(req);
  }
}
