import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { organizerGuard } from './core/guards/organizer.guard';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
    // Public routes
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },

    // Auth routes (guest only - redirect to dashboard if already logged in)
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

    // Protected routes (auth required)
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },

    // Event routes (public for viewing, protected for create/edit)
    {
        path: 'events',
        loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent)
    },
    {
        path: 'events/:id',
        loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent)
    },
    {
        path: 'events/create',
        loadComponent: () => import('./pages/event-create/event-create.component').then(m => m.EventCreateComponent),
        canActivate: [authGuard, organizerGuard]
    },
    {
        path: 'events/:id/edit',
        loadComponent: () => import('./pages/event-edit/event-edit.component').then(m => m.EventEditComponent),
        canActivate: [authGuard, organizerGuard]
    },

    // Booking routes (auth required)
    {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        canActivate: [authGuard]
    },
    {
        path: 'wallet',
        loadComponent: () => import('./pages/wallet/wallet.component').then(m => m.WalletComponent),
        canActivate: [authGuard]
    },
    {
        path: 'ticket/:id',
        loadComponent: () => import('./pages/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent),
        canActivate: [authGuard]
    },

    // Scanner routes (organizer only)
    {
        path: 'scan',
        loadComponent: () => import('./pages/scan-ticket/scan-ticket.component').then(m => m.ScanTicketComponent),
        canActivate: [authGuard, organizerGuard]
    },
    {
        path: 'verify',
        loadComponent: () => import('./pages/verify-ticket/verify-ticket.component').then(m => m.VerifyTicketComponent),
        canActivate: [authGuard, organizerGuard]
    },

    // Fallback route
    { path: '**', redirectTo: '' }
];
