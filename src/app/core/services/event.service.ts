import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  createEvent(data: any): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events/`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateEvent(id: number, data: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}/`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
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

  //  Gère les deux cas : tableau direct ou réponse paginée {results: [...]}
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/categories/`).pipe(
      map(response => Array.isArray(response) ? response : (response.results ?? []))
    );
  }
}