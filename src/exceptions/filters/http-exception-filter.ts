import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>(); // Use FastifyReply for Fastify
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };

    const errorMessage =
      typeof exceptionResponse === 'object' && exceptionResponse['message']
        ? Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message']
          : { message: exceptionResponse['message'].startsWith('\nInvalid `this.prisma.')?"Prisma Connection Or Network Errors":exceptionResponse['message'] }
        : exception.message || 'Unknown error'


    const errorMessagesArray = Array.isArray(errorMessage) ? errorMessage : [errorMessage];

    const customErrorResponse = {
      success: false,
      statusCode: status,
      messages: errorMessagesArray,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Fastify uses reply.code() instead of response.status()
    response.code(status).type('application/json').send(customErrorResponse); // Use .send() in Fastify
  }
}
