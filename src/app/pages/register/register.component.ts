import { Component } from '@angular/core';
import { RegisterRequest } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { JsonParserService } from '../../services/json-parser.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';

/**
 * @fileoverview RegisterComponent, purpose of redering a page enabling a new user to register.
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private errorJsonService: JsonParserService
  ) {}

  register() {
    this.errorMsg = [];
    this.authService
      .register({
        body: this.registerRequest,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }
  login() {
    this.router.navigate(['login']);
  }

  private handleError(error: any) {
    const parsedError: ApiErrorResponse =
      this.errorJsonService.parseErrorResponse(error.error, error.status);
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
