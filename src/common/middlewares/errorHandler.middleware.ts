import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../DTO/apiResponse';
import { EntityNotFoundError } from '../errors/entityNotFound.error';

@Catch()
export class ErrorHandlerMiddleware implements ExceptionFilter {
  private readonly _logger: Logger;

  constructor() {
    this._logger = new Logger(ErrorHandlerMiddleware.name);
  }

  public catch(error: Error, host: ArgumentsHost): void {
    const apiResponse = new ApiResponse();

    let status = 500;
    let errorMessage: string | string[] = 'Internal server error';

    if (error instanceof HttpException) {
      status = error.getStatus();

      const response = error.getResponse() as any;
      if (response?.message != null) {
        errorMessage = response.message;
      }
    } else if (error instanceof EntityNotFoundError) {
      status = 404;
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (status == 500) {
      this._logger.error(errorMessage, error.stack);
    }

    apiResponse.status = status;
    apiResponse.error = errorMessage;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(status).json(apiResponse);
  }
}
