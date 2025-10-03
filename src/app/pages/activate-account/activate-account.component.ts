import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/services';
import { CommonModule, NgIf } from '@angular/common';
import { JsonParserService } from '../../services/json-parser.service';
import { ApiErrorResponse } from '../../services/models/api-error-response';
import { DefaulErrorHandlerService } from '../../services/error/default-error-handler.service';


/**
 * @fileoverview ActivateAccountComponent, purpose of enabling user account
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent {

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private errorHandler = inject(DefaulErrorHandlerService);
  private fb = inject(FormBuilder);

  message = signal<string[]>([]);
  isOkay = signal<boolean>(true);
  submitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  activationForm: FormGroup = this.fb.group({
    activationCode: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(){
    if(this.activationForm.invalid){
      this.activationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.confirmAccount(this.activationForm.get('activationCode')?.value);
  }

  resetForm() {
    this.submitted.set(false);
    this.activationForm.reset();
    this.message.set([]);
    this.isOkay.set(true);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string){
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message.set(["Your account has been successfully activated. \nNow you can proceed to login."]);
        this.submitted.set(true);
        this.isOkay.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.message.set(this.errorHandler.handleError(error));
        this.isLoading.set(false);
      }
    });
  }

}
