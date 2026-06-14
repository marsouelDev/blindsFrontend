import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Event, EventCreate, EventUpdate, Category } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEvents(params?: { category?: string; search?: string; is_online?: boolean; page?: number }): Observable<{ count: number; next: string | null; previous: string | null; results: Event[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.is_online !== undefined) httpParams = httpParams.set('is_online', params.is_online.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
    }
    return this.http.get<{ count: number; next: string | null; previous: string | null; results: Event[] }>(`${this.apiUrl}/events/`, { params: httpParams });
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}/`);
  }

  createEvent(data: FormData): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events/`, data);
  }

  updateEvent(id: number, data: FormData): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}/`, data);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}/`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/my_events/`);
  }

  publishEvent(id: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.apiUrl}/events/${id}/publish/`, {});
  }

  cancelEvent(id: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.apiUrl}/events/${id}/cancel/`, {});
  }

  // Categories avec données mockées (quand l'API est indisponible)
  getCategories(): Observable<Category[]> {
    // DÉCOMMENTER POUR UTILISER L'API REELLE
    // return this.http.get<Category[]>(`${this.apiUrl}/categories/`);

    // DONNÉES MOCKÉES POUR LE TEST (à supprimer quand l'API fonctionne)
    return of([
      { id: 1, name: 'Musique', slug: 'musique' },
      { id: 2, name: 'Gala', slug: 'gala' },
      { id: 3, name: 'Culture', slug: 'culture' },
      { id: 4, name: 'Sport', slug: 'sport' },
      { id: 5, name: 'Conférence', slug: 'conference' },
      { id: 6, name: 'Festival', slug: 'festival' }
    ]).pipe(delay(500));
  }
}
