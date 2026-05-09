import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { addIcons } from 'ionicons';
import { eye, eyeOff, cameraOutline } from 'ionicons/icons';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';

import {
  IonContent, IonItem, IonLabel, IonInput,
  IonButton, IonText, IonCheckbox, IonIcon, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonItem, IonLabel, IonInput,
    IonButton, IonText, IonCheckbox, IonIcon, IonNote
  ],
  templateUrl: './registration-page.html',
  styleUrls: ['./registration-page.css'],
})
export default class RegistrationPage {
  auth = inject(Authentication);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  firestore = inject(Firestore);

  email = '';
  password = '';
  confirmPassword = '';
  nombre = '';
  apellidos = '';
  termsAccepted = false;
  submitted = false;
  serverEmailError = '';
  error = '';
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  avatarFile: File | null = null;
  avatarPreview: string | null = null;

  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{7,}$';

  constructor() {
    addIcons({ eye, eyeOff, cameraOutline });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.avatarFile = file;

    // Comprimir antes de convertir a base64
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 256;
        const ratio = Math.min(MAX / img.width, MAX / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.avatarPreview = canvas.toDataURL('image/jpeg', 0.8);
        this.cdr.detectChanges();
      };
    };
    reader.readAsDataURL(file);
  }

  async onRegistration(form: NgForm): Promise<void> {
    this.submitted = true;
    this.serverEmailError = '';
    this.error = '';

    if (
      form.invalid ||
      this.password !== this.confirmPassword ||
      !this.termsAccepted ||
      !this.avatarFile
    ) return;

    this.loading = true;

    try {
      // 1. Crear usuario en Firebase Auth
      const user = await this.auth.register(this.email, this.password);
      const uid = user.uid;

      // 2. Guardar perfil en Firestore con foto en base64
      await setDoc(doc(this.firestore, 'users', uid), {
        email: this.email,
        nombre: this.nombre,
        apellidos: this.apellidos,
        photoBase64: this.avatarPreview,
        createdAt: new Date(),
      });

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

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }
}
