import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { organizerGuard } from './core/guards/organizer.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'events/:id', loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  
  // Auth routes
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
  
  // Participant routes
  { path: 'wallet', loadComponent: () => import('./pages/wallet/wallet.component').then(m => m.WalletComponent), canActivate: [authGuard] },
  { path: 'ticket/:id', loadComponent: () => import('./pages/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  
  // Organizer routes
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard, organizerGuard] },
  { path: 'events/create', loadComponent: () => import('./pages/event-create/event-create.component').then(m => m.EventCreateComponent), canActivate: [authGuard, organizerGuard] },
  { path: 'events/:id/edit', loadComponent: () => import('./pages/event-edit/event-edit.component').then(m => m.EventEditComponent), canActivate: [authGuard, organizerGuard] },
  { path: 'scan', loadComponent: () => import('./pages/scan-ticket/scan-ticket.component').then(m => m.ScanTicketComponent), canActivate: [authGuard, organizerGuard] },
  
  // Fallback
  { path: '**', redirectTo: '/home' }
];