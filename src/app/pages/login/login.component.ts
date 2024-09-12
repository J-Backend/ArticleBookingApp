import { Component } from '@angular/core';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
