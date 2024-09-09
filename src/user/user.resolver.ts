import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import  { CreateUserDto } from './dto/user.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => User)
  async register(@Args('createUserDto') createUserDto: CreateUserDto, @Context() context) {
    return this.userService.register(createUserDto);
  }

  @Mutation(() => String)
  async login(@Args('username') username: string, @Args('password') password: string) {
    console.log("login:",{  username, password });
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.login(user);
    return token.access_token;
  }
  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async protectedRoute() {
    return 'This is a protected route';
  }
}
