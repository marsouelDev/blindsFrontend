import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !authReq.url.includes('/auth/refresh/') && !authReq.url.includes('/auth/login/')) {
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            const newReq = authReq.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
            return next(newReq);
          }),
          catchError((refreshError) => {
            authService.logout().subscribe();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
