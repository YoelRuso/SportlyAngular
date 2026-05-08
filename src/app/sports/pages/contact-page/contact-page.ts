import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
// Ionic Imports
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  linkOutline,
  schoolOutline,
  callOutline,
  logoGithub,
  logoLinkedin,
} from 'ionicons/icons';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

interface ContactItem {
  icon: string; // Nombre del icono de Ionic (ej: 'mail-outline')
  type: 'email' | 'link' | 'text';
  value: string;
  href: string;
}

interface ContactInfo {
  title: string;
  description: string;
  items: ContactItem[];
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
  ],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactPage implements OnInit {
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  contact: ContactInfo | null = null;
  loading = true;
  error = false;

  constructor() {
    // Registra aquí los iconos que vayas a usar en tu base de datos
    addIcons({ mailOutline, linkOutline, schoolOutline, callOutline, logoGithub, logoLinkedin });
  }

  ngOnInit(): void {
    this.loadContact();
  }

  private async loadContact(): Promise<void> {
    try {
      const snapshot = await getDoc(doc(this.firestore, 'contact', 'info'));
      if (snapshot.exists()) {
        this.contact = snapshot.data() as ContactInfo;
      } else {
        this.error = true;
      }
    } catch (e) {
      console.error('Error cargando contacto:', e);
      this.error = true;
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
