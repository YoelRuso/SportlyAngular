import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { collection, getDocs } from '@angular/fire/firestore'
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Firestore } from '@angular/fire/firestore';

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-legal-page',
  imports: [CommonModule, Header, Footer],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LegalPage implements OnInit {
  firestore = inject(Firestore);
  sections: LegalSection[] = [];
  active: LegalSection | null = null;
  sidebarOpen = false;
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
    this.sidebarOpen = false;
    this.cdr.markForCheck();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }

  private async loadLegal(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(this.firestore, 'legal'));
      this.sections = snapshot.docs.map((doc) => doc.data() as LegalSection);

      // Orden fijo del sidebar
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
