import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength, } from 'class-validator';
import { ApiProperty,  OmitType,  PartialType, PickType } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;
  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'User password',
    example: '123AbcZ%&Y45678',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
  @IsOptional()
  @ApiProperty({ enum: ['Admin', 'Moderator', 'User'], example: 'User', required: false })
  
  role?: 'Admin' | 'Moderator' | 'User';
}

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {}
export class UpdateUserDto  extends PartialType(CreateUserDto){}
