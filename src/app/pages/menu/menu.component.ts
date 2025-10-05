import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { TokenService } from '../../services/token/token.service';
import { filter } from 'rxjs/operators';

/**
 * @fileoverview MenuComponent, purpose of managing the Menu Nav Tab
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-menu',
  imports: [RouterLink, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  username = this.userService.usernameSignal;

  
  logout() {
    this.tokenService.removeToken();
    this.userService.removeUsername();
    this.router.navigate(['login']);
  }

  /**
  ngOnInit(): void {

    const linkColor = document.querySelectorAll('.nav-link');
    linkColor.forEach(link => {
      //if(window.location.href.endsWith(link.getAttribute('href') || '')){
      //  link.classList.add('active');
      //}
      link.addEventListener('click', () => {
        linkColor.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      })
    });
  }
  */

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const linkColor = document.querySelectorAll('.nav-link');
      linkColor.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', event.urlAfterRedirects.includes(href));
      });
    });
  }

}
