import { Component } from '@angular/core';
import { AuthenticationRequest } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';
import { JsonParserService } from '../../services/json-parser.service';
import { UserService } from '../../services/user.service';

/**
 * @fileoverview LoginComponent, purpose of Log in users to get valid token for accessing
 *  the rest of the api
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private errorParserService: JsonParserService,
    private userService: UserService
  ){}

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (response) => {
        // save the token
        this.tokenService.token = response.token as string;
        this.userService.username = this.authRequest.email;
        this.router.navigate(['my-books']);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  private handleError(error: any) {
      const parsedError: ApiErrorResponse =
        this.errorParserService.parseErrorResponse(error.error);
      if (undefined === parsedError.timestamp) {
        this.errorMsg.push('Something went wrong');
        return;
      }
      if (
        parsedError.validationErrors &&
        parsedError.validationErrors.length > 0
      ) {
        this.errorMsg = parsedError.validationErrors;
      } else {
        this.errorMsg.push(parsedError.errorMessage);
      }
      console.log(error);
    }
}
