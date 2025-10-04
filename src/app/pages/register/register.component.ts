import { Component, computed, signal } from '@angular/core';
import { RegisterRequest } from '../../services/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { CommonModule } from '@angular/common';
import { DefaulErrorHandlerService } from '../../services/error/default-error-handler.service';

/**
 * @fileoverview RegisterComponent, purpose of redering a page enabling a new user to register.
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  readonly errorMessages = signal<string[]>([]);
  readonly isLoading = signal(false);
  readonly registerForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private errorHandlerService: DefaulErrorHandlerService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessages.set([]);

    const registerRequest: RegisterRequest = {
      email: this.registerForm.get('email')?.value,
      first_name: this.registerForm.get('firstName')?.value,
      last_name: this.registerForm.get('lastName')?.value,
      password: this.registerForm.get('email')?.value,
    };

    this.authService.register({
      body: registerRequest
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['activate-account']);
      },
      error: (error: any) => {
        this.errorMessages.set(this.errorHandlerService.handleError(error));
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get firstNameControl() {
    return this.registerForm.get('firstName');
  }

  get lastNameControl() {
    return this.registerForm.get('lastName');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }
}
