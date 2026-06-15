import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  currentUser: User | null = null;
  isAuthenticated = false;
  isOrganizer = false;
  mobileMenuOpen = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isOrganizer = user?.profile?.role === 'organizer';
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.showSuccess('Déconnexion réussie');
        this.router.navigate(['/home']);
      },
      error: () => {
        localStorage.clear();
        window.location.href = '/home';
      }
    });
  }
}
