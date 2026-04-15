import { Component, inject } from '@angular/core';
import { Authentication } from '../../services/authentication'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export default class LoginPage {
  auth = inject(Authentication);

  password: string = '';
  email: string = '';
  error: string = '';
  loading: boolean = false;

  userEmail: string | null | undefined = '';


  async onLogin() {
      console.log("Loginprocess started");
    this.error = '';
    this.loading = true;

    try {
      this.auth.login(this.email, this.password);
      console.log("Succesfully logged in Mr.");
      console.log("Email " + this.auth.getCurrentUser()?.email);
      this.userEmail = this.auth.getCurrentUser()?.email;
      console.log("EmailToken " + this.auth.getCurrentUser()?.uid);
    }
    catch (err: any) {
      this.error = err.message || 'no puede entrar';
    }
    finally {
      console.log("Loginprocess over");
      this.loading = false;
    }
  }
}
