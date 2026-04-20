import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-summary',
  imports: [CommonModule],
  templateUrl: './card-summary.html',
  styleUrl: './card-summary.css',
})
export class CardSummary {
  @Input({ required: true }) article!: import('../../interfaces/news-article').NewsArticle;

  readonly fallbackImage = 'images/tenis.png';

  get metaLabel(): string {
    const category = this.article?.category || 'Resumen';
    const author = this.article?.author || 'Sportly';
    return `${category} / ${author}`;
  }

  get formattedDate(): string {
    const rawDate = this.article?.date;
    if (!rawDate) {
      return 'Fecha no disponible';
    }

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
      return rawDate;
    }

    return parsed.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (image) {
      image.src = this.fallbackImage;
    }
  }
}
