import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogResolver } from './blog.resolver';

@Module({
  providers: [BlogService,BlogResolver],
  controllers: [BlogController]
})
export class BlogModule {}
