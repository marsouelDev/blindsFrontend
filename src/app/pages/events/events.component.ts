import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Event, Category } from '../../core/models/event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  private eventService = inject(EventService);

  events: Event[] = [];
  categories: Category[] = [];
  isLoading = true;
  totalCount = 0;
  currentPage = 1;
  totalPages = 0;

  // Filters
  searchQuery = '';
  selectedCategory = '';
  isOnline: boolean | null = null;
  showFilters = false;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadCategories();
    this.loadEvents();
  }

  loadCategories() {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadEvents() {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage
    };

    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.isOnline !== null) params.is_online = this.isOnline;

    this.eventService.getEvents(params).subscribe({
      next: (response) => {
        this.events = response.results;
        this.totalCount = response.count;
        this.totalPages = Math.ceil(response.count / 10);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadEvents();
  }

  onCategoryChange(categorySlug: string) {
    this.selectedCategory = categorySlug;
    this.currentPage = 1;
    this.loadEvents();
  }

  onOnlineFilterChange(value: boolean | null) {
    this.isOnline = value;
    this.currentPage = 1;
    this.loadEvents();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.isOnline = null;
    this.currentPage = 1;
    this.loadEvents();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'published': return 'status-published';
      case 'cancelled': return 'status-cancelled';
      case 'ended': return 'status-ended';
      default: return 'status-draft';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'published': return 'PUBLIÉ';
      case 'cancelled': return 'ANNULÉ';
      case 'ended': return 'TERMINÉ';
      default: return 'BROUILLON';
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
