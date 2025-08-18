import { Component } from '@angular/core';
import { RegisterRequest } from '../../services/models';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
login() {
throw new Error('Method not implemented.');
}
register() {
throw new Error('Method not implemented.');
}

  registerRequest: RegisterRequest = {email: '', first_name: '', last_name: '', password: ''};
  errorMsg: Array<string> = [];
}
