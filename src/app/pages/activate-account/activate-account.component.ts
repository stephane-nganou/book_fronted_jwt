import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/services';
import { NgIf } from '@angular/common';
import { JsonParserService } from '../../services/json-parser.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';


/**
 * @fileoverview ActivateAccountComponent, purpose of enabling user account
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
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
    private authService: AuthenticationService,
    private errorParseService: JsonParserService
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
        this.handleError(error);
      }
    })
  }

  private handleError(error: any) {
      const parsedError: ApiErrorResponse = this.errorParseService.parseErrorResponse(error.error, error.status);
      
      this.message = parsedError.errorMessage;
      this.submitted = true;
      this.isOkay = false;
      console.log(error);
    }
}
