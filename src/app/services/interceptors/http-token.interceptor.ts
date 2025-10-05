import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { inject } from '@angular/core';

/**
 * @fileoverview httpTokenInterceptor, purpose of enforcing the Authorization header, when user is loggin
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
export const httpTokenInterceptor: HttpInterceptorFn = (
      req: HttpRequest<any>,
      next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const tokenService: TokenService = inject(TokenService);
  const token = tokenService.token;

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
