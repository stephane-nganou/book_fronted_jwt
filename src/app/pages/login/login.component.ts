import { Component } from '@angular/core';
import { AuthenticationRequest } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';
import { JsonParserService } from '../../services/json-parser.service';

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
    private errorParserService: JsonParserService
  ){}

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (response) => {
        // save the token
        this.tokenService.token = response.token as string;

        this.router.navigate(['books']);
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
      if (null === parsedError.timestamp) {
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
