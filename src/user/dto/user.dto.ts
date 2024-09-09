import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
@InputType()
export class CreateUserDto {
  @Field()
  // @IsNotEmpty({ message: 'Name is required.' })
  // @IsString({ message: 'Name must need to be one string.' })
  username: string;

  @Field()
  // @IsNotEmpty({ message: 'Password is required.' })
  // @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;
}
