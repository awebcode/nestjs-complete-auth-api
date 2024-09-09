import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType() // <-- This decorator defines the class as a GraphQL type
export class User {
  @Field(() => Int) // Define each field with appropriate GraphQL type
  id?: number;

  @Field()
  username: string;

  @Field()
  password: string;
}
