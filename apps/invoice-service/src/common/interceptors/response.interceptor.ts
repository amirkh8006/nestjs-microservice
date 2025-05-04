import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res)),
      catchError((err: HttpException) => throwError(() => this.errorHandler(err, context))),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      console.log('Exception Error => ', exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      success: false,
      message: exception.message,
    });
  }

  responseHandler(res: any) {
    if (res) {
      return {
        success: true,
        message: res.message ?? undefined,
        data: res.data ?? undefined,
        count: res.count ?? undefined,
      };
    }
  }
}
