import { Injectable } from '@angular/core';

/**
 * @fileoverview TokenService, purpose of managing tokens
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {}

  set token(token: string){
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  removeToken() {
    if(this.isAuthenticated()){
      localStorage.removeItem('token');
    }
  }

}
