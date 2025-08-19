import { Component } from '@angular/core';
import { RegisterRequest } from '../../services/models';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerRequest: RegisterRequest = {email: '', first_name: '', last_name: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ){
    //
  }

  login() {
    this.errorMsg = []
    this.authService.register({
      body: this.registerRequest
    }).subscribe({
      next: () => {
        this.router.navigate(['activate-account']);
      },
      error: (error) => {
        if(error.error.validationErrors && error.error.validationErrors.length > 0){
          this.errorMsg = error.error.validationErrors;
        }else{
          this.errorMsg.push(error.error.errorMessage);
        }
      }
    })
  }
  register() {
    this.router.navigate(['login']);
  }

}
