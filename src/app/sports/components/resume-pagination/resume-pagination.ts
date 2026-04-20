import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resume-pagination',
  imports: [],
  templateUrl: './resume-pagination.html',
  styleUrl: './resume-pagination.css',
})
export class ResumePagination {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get compactPages(): Array<number | null> {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1;
    const pages: Array<number | null> = [];

    for (let page = 1; page <= total; page += 1) {
      const includePage = page === 1 || page === total || (page >= current - delta && page <= current + delta);
      if (includePage) {
        pages.push(page);
        continue;
      }

      if (pages[pages.length - 1] !== null) {
        pages.push(null);
      }
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}

