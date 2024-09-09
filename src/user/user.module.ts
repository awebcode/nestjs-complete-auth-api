import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from 'src/config/Env';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserResolver } from './user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ENV.jwtSecret, // Store this in .env in production
      signOptions: { expiresIn: '1h' },
    }),
  
  ],
  providers: [UserService, UserResolver],
  controllers: [UserController],
})
export class UserModule {}
