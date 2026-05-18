import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';
import { eyeOffOutline, eyeOutline, sparklesOutline } from 'ionicons/icons';

import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonCheckbox,
    IonNote,
    IonText,
    IonIcon,
  ],
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
  rememberMe: boolean = false;
  showPassword = false;

  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  readonly eyeOutline = eyeOutline;
  readonly eyeOffOutline = eyeOffOutline;
  readonly sparklesOutline = sparklesOutline;

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
      // Guardar email si recordarme está activo
      if (this.rememberMe) {
        localStorage.setItem('sportly_remember_email', this.email);
      } else {
        localStorage.removeItem('sportly_remember_email');
      }
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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    const remembered = localStorage.getItem('sportly_remember_email');
    if (remembered) {
      this.email = remembered;
      this.rememberMe = true;
    }
  }
}
