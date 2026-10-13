import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Simple error interceptor to catch HTTP failures globally and log them
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API request failed:', error.message);
      return throwError(() => error);
    })
  );
};