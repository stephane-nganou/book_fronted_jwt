import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  set username(username: string){
    localStorage.setItem('username', username);
  }

  get username() {
    return localStorage.getItem('username') as string;
  }

  removeUsername() {
    if(this.username !== null){
      localStorage.removeItem('username');
    }
  }
}
