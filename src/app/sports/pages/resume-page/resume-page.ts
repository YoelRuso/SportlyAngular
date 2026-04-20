import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { CardSummary } from '../../components/card-summary/card-summary';
import { ResumePagination } from '../../components/resume-pagination/resume-pagination';
import { NewsArticle, NewsSportFilter } from '../../interfaces/news-article';
import { NewsData } from '../../services/news-data';

@Component({
  selector: 'app-resume-page',
  imports: [Header, Footer, Navbar, HeroBanner, CardSummary, ResumePagination],
  templateUrl: './resume-page.html',
  styleUrl: './resume-page.css',
})
export default class ResumePageComponent implements OnInit {
  readonly pageSize = 6;

  selectedSport: NewsSportFilter = 'all';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';

  private allNews: NewsArticle[] = [];
  visibleNews: NewsArticle[] = [];
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private readonly newsData: NewsData) {}

  get paginatedNews(): NewsArticle[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.visibleNews.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.visibleNews.length / this.pageSize));
  }

  get isEmptyState(): boolean {
    return !this.isLoading && !this.errorMessage && this.visibleNews.length === 0;
  }

  ngOnInit(): void {
    this.loadNews();
  }

  onFilterChange(sport: string): void {
    this.selectedSport = this.normalizeSportFilter(sport);
    this.currentPage = 1;
    this.applyFilter();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  private loadNews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.newsData
      .getAllNews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (articles) => {
          this.allNews = articles;
          this.applyFilter();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.allNews = [];
          this.visibleNews = [];
          this.errorMessage = 'No se pudieron cargar las noticias desde Firestore.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private applyFilter(): void {
    if (this.selectedSport === 'all') {
      this.visibleNews = this.allNews;
      return;
    }

    this.visibleNews = this.allNews.filter((article) => article.sport === this.selectedSport);
  }

  private normalizeSportFilter(value: string): NewsSportFilter {
    if (value === 'soccer' || value === 'basketball' || value === 'tennis' || value === 'f1') {
      return value;
    }
    return 'all';
  }
}
