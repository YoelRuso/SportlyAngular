import { inject, Injectable } from '@angular/core';
import { collection, getDocs } from '@angular/fire/firestore'
import { catchError, forkJoin, from, map, Observable, throwError } from 'rxjs';
import { NewsArticle, NewsSportFilter } from '../interfaces/news-article';
import { Firestore } from '@angular/fire/firestore';

type NewsSportKey = Exclude<NewsSportFilter, 'all'>;

type FirestoreNewsDoc = {
  title?: string;
  headline?: string;
  description?: string;
  summary?: string;
  content?: string;
  image?: string;
  imageUrl?: string;
  urlToImage?: string;
  thumbnail?: string;
  author?: string;
  source?: string;
  category?: string;
  section?: string;
  date?: string;
  publishedAt?: string;
  createdAt?: { toDate?: () => Date } | Date | string;
  url?: string;
  link?: string;
};

@Injectable({
  providedIn: 'root',
})
export class NewsData {
  firestore = inject(Firestore);
  private readonly collectionBySport: Record<NewsSportKey, { collection: string; category: string }> = {
	soccer: { collection: 'news-soccer', category: 'Futbol' },
	basketball: { collection: 'news-basket', category: 'Baloncesto' },
	tennis: { collection: 'news-tenis', category: 'Tenis' },
	f1: { collection: 'news-f1', category: 'F1' },
  };

  getAllNews(): Observable<NewsArticle[]> {
	const requests = (Object.keys(this.collectionBySport) as NewsSportKey[]).map((sport) =>
	  this.getNewsCollection(sport)
	);

	return forkJoin(requests).pipe(
	  map((groupedNews) => groupedNews.flat().sort((left, right) => this.getTime(right.date) - this.getTime(left.date)))
	);
  }

  private getNewsCollection(sport: NewsSportKey): Observable<NewsArticle[]> {
	const source = this.collectionBySport[sport];
	const collectionRef = collection(this.firestore, source.collection);

	return from(getDocs(collectionRef)).pipe(
	  map((snapshot) =>
		snapshot.docs.map((doc) => this.mapArticle(doc.id, doc.data() as FirestoreNewsDoc, sport, source.category))
	  ),
	  catchError((error) =>
		throwError(() => new Error(`No se pudieron cargar noticias de ${source.collection}: ${String(error)}`))
	  )
	);
  }

  private mapArticle(id: string, data: FirestoreNewsDoc, sport: NewsSportKey, defaultCategory: string): NewsArticle {
	return {
	  id,
	  sport,
	  title: this.pickString(data.title, data.headline, 'Sin titular'),
	  description: this.pickString(data.description, data.summary, data.content, 'Sin descripcion disponible.'),
	  image: this.pickString(data.image, data.imageUrl, data.urlToImage, data.thumbnail, ''),
	  author: this.pickString(data.author, data.source, 'Sportly'),
	  category: this.pickString(data.category, data.section, defaultCategory),
	  date: this.pickDate(data.date, data.publishedAt, data.createdAt),
	  url: this.pickString(data.url, data.link, '#'),
	};
  }

  private pickString(...values: Array<string | undefined>): string {
	for (const value of values) {
	  if (typeof value === 'string' && value.trim()) {
		return value.trim();
	  }
	}
	return '';
  }

  private pickDate(...values: Array<string | Date | { toDate?: () => Date } | undefined>): string {
	for (const value of values) {
	  if (!value) {
		continue;
	  }

	  if (typeof value === 'string' && value.trim()) {
		return value;
	  }

	  if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString();
	  }

	  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
		const date = value.toDate();
		if (!Number.isNaN(date.getTime())) {
		  return date.toISOString();
		}
	  }
	}

	return '';
  }

  private getTime(rawDate: string): number {
	if (!rawDate) {
	  return 0;
	}

	const parsedDate = new Date(rawDate);
	return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  }
}

