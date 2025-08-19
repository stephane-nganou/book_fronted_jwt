import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/services';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-activate-account',
  imports: [NgIf, FormsModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent {

  message = '';
  isOkay = true;
  submitted = false;
  activation_code = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ){}

  onCodeCompleted(){
    console.log(`Actication code: ${this.activation_code}`);
    this.confirmAccount(this.activation_code);
  }

  redirectToLogin() {
    this.router.navigate(['login'])
  }

  private confirmAccount(token: string){
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = "Your account has been successfully activated. \nNow you can proceed to login";
        this.submitted = true;
        this.isOkay = true;
      },
      error: (error) => {
        console.log(`Error: ${error}`)
        this.message = error.error.message;
        this.submitted = true;
        this.isOkay = false;
      }
    })
  }
}
