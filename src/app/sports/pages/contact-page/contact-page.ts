import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  linkOutline,
  schoolOutline,
  callOutline,
  logoGithub,
  logoLinkedin,
  alertCircleOutline,
} from 'ionicons/icons';

import {
  IonContent,
  IonSpinner,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

interface ContactItem {
  icon: string;
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
    IonSpinner,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
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
    addIcons({
      mailOutline,
      linkOutline,
      schoolOutline,
      callOutline,
      logoGithub,
      logoLinkedin,
      alertCircleOutline,
    });
  }

  ngOnInit(): void {
    this.loadContact();
  }

  private async loadContact(): Promise<void> {
    this.loading = true;
    this.error = false;
    this.cdr.markForCheck();

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
