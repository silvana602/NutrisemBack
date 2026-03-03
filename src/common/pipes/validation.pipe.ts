import { ValidationPipe } from '@nestjs/common';

/**
 * Global validation pipe for request DTOs.
 *
 * Usage (main.ts):
 *   app.useGlobalPipes(validationPipe);
 */
export const validationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  stopAtFirstError: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  validationError: {
    target: false,
    value: false,
  },
});
