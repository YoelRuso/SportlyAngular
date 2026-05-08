import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

// Ionic + Icons
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonLabel, IonButton,
  IonMenu, IonMenuButton, IonSplitPane,
  IonButtons, IonSpinner, IonIcon, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  chevronForward,
  alertCircleOutline,
  refresh,
  documentText
} from 'ionicons/icons';

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonButton,
    IonMenu, IonMenuButton, IonSplitPane,
    IonButtons, IonSpinner, IonIcon
  ],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LegalPage implements OnInit {
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private menuCtrl = inject(MenuController);

  sections: LegalSection[] = [];
  active: LegalSection | null = null;
  loading = true;
  error = false;

  private pendingFragment: string | null = null;

  constructor() {
    // Registrar iconos para que funcionen en modo standalone
    addIcons({
      documentTextOutline,
      chevronForward,
      alertCircleOutline,
      refresh,
      documentText
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      this.pendingFragment = fragment;
      this.applyFragment();
      this.cdr.markForCheck();
    });

    this.loadLegal();
  }

  async select(section: LegalSection) {
    this.active = section;
    this.cdr.markForCheck();
    // Cierra el menú lateral (solo tiene efecto en móvil)
    await this.menuCtrl.close('legal-menu');
  }

  async loadLegal(): Promise<void> {
    this.loading = true;
    this.error = false;
    this.cdr.markForCheck();

    try {
      const snapshot = await getDocs(collection(this.firestore, 'legal'));
      this.sections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as LegalSection));

      const ORDER = ['aviso-legal', 'privacidad', 'cookies', 'accesibilidad'];
      this.sections.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

      this.applyFragment();
    } catch (e) {
      console.error('Error:', e);
      this.error = true;
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private applyFragment(): void {
    if (this.sections.length === 0) return;
    if (this.pendingFragment) {
      const found = this.sections.find((s) => s.id === this.pendingFragment);
      this.active = found ?? this.sections[0];
    } else if (!this.active) {
      this.active = this.sections[0];
    }
  }
}
