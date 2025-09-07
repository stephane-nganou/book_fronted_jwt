import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * @fileoverview MenuComponent, purpose of managing the Menu Nav Tab
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

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
    })
  }
  logout() {
    throw new Error('Method not implemented.');
  }

}
