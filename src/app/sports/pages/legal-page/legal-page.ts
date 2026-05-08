import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

// Ionic imports
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonLabel, IonButton,
  IonMenu, IonMenuButton, IonMenuToggle,
  IonSplitPane, IonButtons, IonSpinner, IonIcon
} from '@ionic/angular/standalone';

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
    IonMenu, IonMenuButton, IonMenuToggle,
    IonSplitPane, IonButtons, IonSpinner, IonIcon
  ],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LegalPage implements OnInit {
  firestore = inject(Firestore);
  sections: LegalSection[] = [];
  active: LegalSection | null = null;
  loading = true;
  error = false;

  private pendingFragment: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      this.pendingFragment = fragment;
      this.applyFragment();
      this.cdr.markForCheck();
    });

    this.loadLegal();
  }

  select(section: LegalSection): void {
    this.active = section;
    this.cdr.markForCheck();
  }

  async loadLegal(): Promise<void> {
    this.loading = true;
    this.error = false;
    this.cdr.markForCheck();

    try {
      const snapshot = await getDocs(collection(this.firestore, 'legal'));
      this.sections = snapshot.docs.map((doc) => doc.data() as LegalSection);

      const ORDER = ['aviso-legal', 'privacidad', 'cookies', 'accesibilidad'];
      this.sections.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

      this.applyFragment();
    } catch (e) {
      console.error('Error cargando legal desde Firebase:', e);
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
