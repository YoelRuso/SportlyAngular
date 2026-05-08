import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { addIcons } from 'ionicons';
import { eye, eyeOff, cameraOutline } from 'ionicons/icons';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { doc, setDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

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
  storage = inject(Storage);
  firestore = inject(Firestore);

  email = '';
  password = '';
  confirmPassword = '';
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

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  async onRegistration(form: NgForm): Promise<void> {
    this.submitted = true;
    this.serverEmailError = '';
    this.error = '';

    if (form.invalid || this.password !== this.confirmPassword || !this.termsAccepted || !this.avatarFile) {
      return;
    }

    this.loading = true;

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await this.auth.register(this.email, this.password);
      const uid = userCredential.uid;

      // 2. Subir foto a Firebase Storage
      const storageRef = ref(this.storage, `avatars/${uid}`);
      await uploadBytes(storageRef, this.avatarFile);
      const photoURL = await getDownloadURL(storageRef);

      // 3. Guardar datos del usuario en Firestore
      await setDoc(doc(this.firestore, 'users', uid), {
        email: this.email,
        photoURL,
        createdAt: new Date(),
      });

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

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }
}
