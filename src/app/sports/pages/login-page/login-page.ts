import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Authentication } from '../../services/authentication'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterLinkActive],
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

  // User Pressed Login button
  async onLogin() {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.login(this.email, this.password);
      // navigate to profile when user exists
      if (this.auth.getCurrentUser()) {
        this.router.navigate(['/profile']);
      }
    }
    catch (err: any) {
      this.error = err.message || 'no puede entrar';
    }
    finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
