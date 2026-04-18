import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from '../../../initialize-firebase';
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
  imports: [CommonModule, Header, Footer],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactPage implements OnInit {
  contact: ContactInfo | null = null;
  loading = true;
  error = false;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadContact();
  }

  private async loadContact(): Promise<void> {
    try {
      const snapshot = await getDoc(doc(firestoreDb, 'contact', 'info'));
      if (snapshot.exists()) {
        this.contact = snapshot.data() as ContactInfo;
      } else {
        this.error = true;
      }
    } catch (e) {
      console.error('Error cargando contacto desde Firebase:', e);
      this.error = true;
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
