import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    const message = this.resolveMessage(exceptionResponse);
    const messageForLog = Array.isArray(message) ? message.join(', ') : message;

    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `HTTP ${status} ${request.method} ${request.url} - ${messageForLog}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }

  private resolveMessage(exceptionResponse: unknown): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.map((item) => String(item));
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Internal server error';
  }
}
