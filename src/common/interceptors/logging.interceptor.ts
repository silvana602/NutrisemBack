import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{ method?: string; url?: string }>();

    const method = request.method ?? 'UNKNOWN';
    const url = request.url ?? '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - now;
          this.logger.log(`${method} ${url} - ${elapsed}ms`);
        },
        error: (error: unknown) => {
          const elapsed = Date.now() - now;
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Unhandled interceptor error';
          this.logger.error(
            `${method} ${url} - ${elapsed}ms - ${errorMessage}`,
          );
        },
      }),
    );
  }
}
