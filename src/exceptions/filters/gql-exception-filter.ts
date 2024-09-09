import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    // Check if the exception is an instance of a known error (e.g., ValidationError, UnauthorizedError)
    if (exception instanceof ApolloError) {
      return exception; // GraphQL standard Apollo error
    }

    // Log the error (you can also use other logging mechanisms here)
    console.error('GraphQL Error:', exception);

    // Default custom error message
    return new ApolloError(exception.message || 'Internal server error', exception.code || 'INTERNAL_SERVER_ERROR', {
      details: exception.response || 'An error occurred',
    });
  }
}
