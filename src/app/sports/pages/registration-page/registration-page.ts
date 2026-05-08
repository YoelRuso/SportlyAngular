import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

// Ionic imports
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonCheckbox,
  IonIcon,
  IonNote,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonCheckbox,
    IonIcon,
    IonNote,
  ],
  templateUrl: './registration-page.html',
  styleUrls: ['./registration-page.css'],
})
export default class RegistrationPage {
  auth = inject(Authentication);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;
  submitted: boolean = false;
  serverEmailError: string = '';
  error: string = '';
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{7,}$';

  constructor() {
    // Registrar los iconos para poder usarlos por nombre en el HTML
    addIcons({ eye, eyeOff });
  }

  async onRegistration(form: NgForm) {
    this.submitted = true;
    this.serverEmailError = '';
    this.error = '';

    if (form.invalid || this.password !== this.confirmPassword || !this.termsAccepted) {
      return;
    }

    this.loading = true;

    try {
      await this.auth.register(this.email, this.password);
      console.log('Registration processed!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      const code = err.code || '';
      const message = err.message || '';

      if (
        code === 'auth/email-already-in-use' ||
        message.toLowerCase().includes('email-already-in-use')
      ) {
        this.serverEmailError = 'Correo electrónico ya existe';
      } else {
        this.error = message || 'Error durante el registro';
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
