import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import {
  User,
  RegisterData,
  LoginData,
  AuthResponse,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://blindsevent-api.onrender.com/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    // ✅ Nettoie toutes les anciennes clés parasites
    const keysToClean = ['user', 'userData', 'currentUser'];
    keysToClean.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val === 'undefined' || val === 'null') {
        localStorage.removeItem(key);
      }
    });

    const access = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('current_user');

    if (access && access !== 'undefined') {
      this.accessTokenSubject.next(access);
    }

    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const user = JSON.parse(userStr);
        if (user && typeof user === 'object') {
          this.currentUserSubject.next(user);
        }
      } catch (e) {
        localStorage.removeItem('current_user');
      }
    } else {
      localStorage.removeItem('current_user');
    }
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, data)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, data)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post(`${this.apiUrl}/logout/`, { refresh: refreshToken })
      .pipe(
        tap(() => {
          this.clearAuth();
          this.router.navigate(['/login']);
        }),
        catchError(() => {
          this.clearAuth();
          this.router.navigate(['/login']);
          return of(null);
        }),
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access);
          this.accessTokenSubject.next(response.access);
        }),
        catchError(() => {
          this.clearAuth();
          this.router.navigate(['/login']);
          return of(null as any);
        }),
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem('current_user', JSON.stringify(user));
      }),
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile/`, data).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem('current_user', JSON.stringify(user));
      }),
    );
  }

  private handleAuthSuccess(response: AuthResponse) {
    if (!response || !response.access) return;

    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);

    if (response.user) {
      localStorage.setItem('current_user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }

    this.accessTokenSubject.next(response.access);
  }

  private clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.accessTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get accessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get isOrganizer(): boolean {
    return this.currentUser?.profile?.role === 'organizer';
  }
}
