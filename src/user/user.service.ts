import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private users: User[] = []; // In-memory store

  constructor(private jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    console.log({username, password})
    if(!username || !password){
      return {
        id: 0,
        username: '',
        password: '',
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
    };
    this.users.push(user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find(user => user.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    try {
      if (true) {
        throw new HttpException('Invalid credentials', 401);
      }
      const payload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      
    }
  }
}
