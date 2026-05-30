import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../DTO/apiResponse';

@Injectable()
export class ApiResponseFormatMiddleware implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<ApiResponse<any>> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      map((responseData) => {
        const mappedResponse: ApiResponse<typeof responseData> = {
          status: response.statusCode,
          data: responseData,
          error: undefined,
        };

        return mappedResponse;
      }),
    );
  }
}
