import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TicketType,
  TicketTypeCreate,
  TicketTypeUpdate,
} from '../models/ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket-types/`; // ✅ slash ajouté

  getTicketTypes(): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(this.apiUrl);
  }

  getTicketType(id: number): Observable<TicketType> {
    return this.http.get<TicketType>(`${this.apiUrl}${id}/`);
  }

  createTicketType(data: TicketTypeCreate): Observable<TicketType> {
    return this.http.post<TicketType>(this.apiUrl, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateTicketType(id: number, data: TicketTypeUpdate): Observable<TicketType> {
    return this.http.put<TicketType>(`${this.apiUrl}${id}/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteTicketType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getTicketTypesByEvent(eventId: number): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(this.apiUrl, {
      params: { event: eventId.toString() },
    });
  }
}
