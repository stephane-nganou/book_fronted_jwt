import { Component, inject, signal } from '@angular/core';
import { AuthenticationRequest, AuthenticationResponse } from '../../services/models';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';
import { JsonParserService } from '../../services/json-parser.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { DefaulErrorHandlerService } from '../../services/error/default-error-handler.service';

/**
 * @fileoverview LoginComponent, purpose of Log in users to get valid token for accessing
 *  the rest of the api
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private tokenService = inject(TokenService);
  private errorHandlerService = inject(DefaulErrorHandlerService);
  private userService = inject(UserService);

  errorMessages = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  isFormSubmitted = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email],],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });


  login() {
    this.isFormSubmitted.set(true);
    if (this.loginForm.invalid) {
      this.errorMessages.set(['Please fill in all required fields correctly']);
      return;
    }

    this.isLoading.set(true);
    this.errorMessages.set([]);

    const authRequest: AuthenticationRequest = this.loginForm.value as AuthenticationRequest;

    this.authService.authenticate(
      { body: authRequest }
    ).subscribe({
      next: (response: AuthenticationResponse) => {
        this.tokenService.token = response.token;
        this.userService.username = authRequest.email;
        this.isLoading.set(false);
        this.router.navigate(['']);
      },
      error: (error) => {
        this.errorMessages.set(this.errorHandlerService.handleError(error));
        this.isLoading.set(false);
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['register']);
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

}
