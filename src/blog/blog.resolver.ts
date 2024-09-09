import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class BlogResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
