import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() sections: LegalSection[] = [];
  @Input() active!: LegalSection;
  @Input() sidebarOpen = false;

  @Output() selectSection = new EventEmitter<LegalSection>();
  @Output() toggle = new EventEmitter<void>();

  select(section: LegalSection) {
    this.selectSection.emit(section);
  }

  toggleSidebar() {
    this.toggle.emit();
  }
}
