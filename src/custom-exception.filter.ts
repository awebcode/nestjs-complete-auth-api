import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let formattedErrors = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      const errorMessages = exceptionResponse['message'];

      for (const [key, messages] of Object.entries(errorMessages)) {
        formattedErrors.push({ [key]: messages });
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: formattedErrors,
    });
  }
}
