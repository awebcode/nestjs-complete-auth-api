import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Blogs')
@Controller('blog')
export class BlogController {

    constructor() { }

    @Get()
    findAll() {
        return 'This action returns all cats';
    }
}
