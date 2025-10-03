import { Injectable, signal } from '@angular/core';

/**
 * @fileoverview UserService, purpose of managing user-related data
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.1.0
 * @date 2025-10-03
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Public signal for username, initialized from localStorage
  readonly usernameSignal = signal<string>(localStorage.getItem('username') || '');

  set username(username: string) {
    localStorage.setItem('username', username);
    this.usernameSignal.set(username);
  }

  removeUsername() {
    localStorage.removeItem('username');
    this.usernameSignal.set('');
  }
}