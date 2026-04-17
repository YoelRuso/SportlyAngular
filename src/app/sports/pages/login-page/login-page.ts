import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export default class LoginPage {
  auth = inject(Authentication);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  password: string = '';
  email: string = '';
  error: string = '';
  loading: boolean = false;
  submitted: boolean = false;

  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  // User Pressed Login button
  async onLogin(form: NgForm) {
    this.submitted = true;
    this.error = '';

    if (form.invalid) {
      return;
    }

    this.loading = true;

    try {
      await this.auth.login(this.email, this.password);
      // navigate to profile when user exists
      if (this.auth.getCurrentUser()) {
        this.router.navigate(['/profile']);
      }
    }
    catch (err: any) {
      const code = err.code || '';
      const message = err.message || '';

      if (code === 'auth/user-not-found' || message.toLowerCase().includes('user-not-found')) {
        this.error = 'Usuario no encontrado';
      } else if (code === 'auth/wrong-password' || message.toLowerCase().includes('wrong-password')) {
        this.error = 'Contraseña incorrecta';
      } else {
        this.error = 'Correo electrónico o contraseña incorrectos';
      }
      console.log(message);
    }
    finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
