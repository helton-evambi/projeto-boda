import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { BodaEvent, SearchSuggestion } from '../../core/models/models';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-header">
      <h2><i class="ri-compass-3-line"></i> Explorar Eventos</h2>
      <div class="header-search" style="position: relative">
        <span class="search-icon"><i class="ri-search-line"></i></span>
        <input type="text" placeholder="Buscar eventos, artistas, locais..."
               [(ngModel)]="searchQuery" (input)="onSearchInput()" (focus)="showSuggestions = true">
        @if (showSuggestions && suggestions.length > 0) {
          <div class="search-suggestions">
            @for (s of suggestions; track s.id) {
              <a [routerLink]="['/event', s.slug]" class="suggestion-item" (click)="showSuggestions = false">
                <img [src]="s.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem">{{ s.title }}</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted)">
                    <i class="ri-map-pin-2-line"></i> {{ s.city || 'Angola' }} · {{ s.category }}
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>

    <div class="content-body">
      <!-- Filters Row -->
      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: center">
        <!-- City Filter -->
        <select class="form-control" style="max-width: 160px; font-size: 0.8rem" [(ngModel)]="selectedCity" (change)="applyFilters()">
          <option value="">Todas as cidades</option>
          @for (city of cities; track city) {
            <option [value]="city">{{ city }}</option>
          }
        </select>

        <!-- Sort -->
        <select class="form-control" style="max-width: 160px; font-size: 0.8rem" [(ngModel)]="sortBy" (change)="applyFilters()">
          <option value="">Relevância</option>
          <option value="date">Data (próximos)</option>
          <option value="popular">Mais popular</option>
          <option value="price_asc">Preço ↑</option>
          <option value="price_desc">Preço ↓</option>
        </select>

        <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: auto">{{ filteredEvents.length }} eventos</span>
      </div>

      <!-- Category Chips -->
      <div class="filters-bar">
        <button class="filter-chip" [class.active]="!selectedCategory" (click)="filterByCategory('')">Todos</button>
        @for (cat of categories; track cat) {
          <button class="filter-chip" [class.active]="selectedCategory === cat" (click)="filterByCategory(cat)">{{ cat }}</button>
        }
      </div>

      @if (loading) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (filteredEvents.length === 0) {
        <div class="empty-state">
          <div class="empty-icon"><i class="ri-calendar-close-line" style="font-size: 3rem"></i></div>
          <h3>Nenhum evento encontrado</h3>
          <p>Tenta outra busca ou filtro.</p>
        </div>
      } @else {
        <div class="events-grid">
          @for (event of filteredEvents; track event.id; let i = $index) {
            <a [routerLink]="['/event', event.slug]" class="event-card" style="text-decoration: none" [style.animation-delay]="i * 0.06 + 's'">
              <div class="event-image-wrapper">
                <img [src]="event.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'" [alt]="event.title">
                @if (event.isFeatured) {
                  <span class="event-badge featured"><i class="ri-star-fill"></i> Destaque</span>
                }
                @if (event.category) {
                  <span class="event-badge category" style="left: auto; right: 12px; top: auto; bottom: 12px">{{ event.category }}</span>
                }
                <div class="event-date-badge">
                  <div class="day">{{ getDay(event.startDateTime) }}</div>
                  <div class="month">{{ getMonth(event.startDateTime) }}</div>
                </div>
              </div>
              <div class="event-content">
                <div class="event-title">{{ event.title }}</div>
                @if (event.venue) {
                  <div class="event-location"><i class="ri-map-pin-2-fill"></i> {{ event.venue.name }}, {{ event.venue.city }}</div>
                }
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px">
                  <div class="event-price">
                    @if (getMinPrice(event) === 0) {
                      <span class="price-tag">Grátis</span>
                    } @else {
                      <span class="price-tag">{{ getMinPrice(event) | number }} Kz</span>
                    }
                  </div>
                  <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-muted)">
                    <span><i class="ri-heart-3-line"></i> {{ event.likesCount }}</span>
                    <span><i class="ri-chat-3-line"></i> {{ event.commentsCount }}</span>
                  </div>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .filters-bar {
      display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto;
      padding-bottom: 4px; scrollbar-width: none;
    }
    .filters-bar::-webkit-scrollbar { display: none; }
    .filter-chip {
      padding: 8px 18px; border: 1px solid var(--border-color); border-radius: 50px;
      background: var(--bg-surface); color: var(--text-secondary); font-family: inherit;
      font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .filter-chip:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .filter-chip.active { background: var(--accent-gradient); color: #000; border-color: transparent; font-weight: 600; }

    .search-suggestions {
      position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-card);
      border: 1px solid var(--border-color); border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg); z-index: 100; max-height: 320px; overflow-y: auto;
      animation: fadeIn 0.2s;
    }
    .suggestion-item {
      display: flex; gap: 12px; align-items: center; padding: 10px 14px;
      text-decoration: none; color: inherit; transition: background 0.15s;
    }
    .suggestion-item:hover { background: var(--bg-hover); }
  `]
})
export class ExploreComponent implements OnInit {
  events: BodaEvent[] = [];
  filteredEvents: BodaEvent[] = [];
  categories: string[] = [];
  cities: string[] = [];
  selectedCategory = '';
  selectedCity = '';
  sortBy = '';
  searchQuery = '';
  loading = true;
  suggestions: SearchSuggestion[] = [];
  showSuggestions = false;

  private searchSubject = new Subject<string>();

  constructor(private api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.length >= 2 ? this.api.searchEvents(q) : of([]))
    ).subscribe(results => {
      this.suggestions = results;
      this.showSuggestions = results.length > 0;
    });
  }

  ngOnInit() {
    this.api.getEvents().subscribe({
      next: events => { this.events = events; this.filteredEvents = events; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getCategories().subscribe(cats => this.categories = cats);
    this.api.getCities().subscribe(cities => this.cities = cities);
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
    this.applyFilters();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.events;
    if (this.selectedCategory) result = result.filter(e => e.category === this.selectedCategory);
    if (this.selectedCity) result = result.filter(e => e.venue?.city === this.selectedCity);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.venue?.name.toLowerCase().includes(q));
    }
    // Sort
    if (this.sortBy === 'date') result = [...result].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    else if (this.sortBy === 'popular') result = [...result].sort((a, b) => b.likesCount - a.likesCount);
    else if (this.sortBy === 'price_asc') result = [...result].sort((a, b) => this.getMinPrice(a) - this.getMinPrice(b));
    else if (this.sortBy === 'price_desc') result = [...result].sort((a, b) => this.getMinPrice(b) - this.getMinPrice(a));

    this.filteredEvents = result;
  }

  getDay(date: string): string { return new Date(date).getDate().toString().padStart(2, '0'); }
  getMonth(date: string): string { return new Date(date).toLocaleString('pt', { month: 'short' }).toUpperCase(); }
  getMinPrice(event: BodaEvent): number {
    if (!event.tickets?.length) return 0;
    return Math.min(...event.tickets.map(t => t.price));
  }
}
