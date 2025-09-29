import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usernameSignal = signal<string>('');

  set username(username: string) {
    localStorage.setItem('username', username);
    this.usernameSignal.set(username);
  }

  get username() {
    this.usernameSignal.set(localStorage.getItem('username') as string);
    return this.usernameSignal();
  }

  removeUsername() {
    if (this.username !== null) {
      localStorage.removeItem('username');
    }
  }
}
