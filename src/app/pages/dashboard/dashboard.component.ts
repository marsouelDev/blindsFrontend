import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { EventService } from '../../core/services/event.service';
import { BookingService } from '../../core/services/booking.service';
import { DashboardStats } from '../../core/models/stats.model';
import { Event } from '../../core/models/event.model';
import { Booking } from '../../core/models/booking.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private statsService = inject(StatsService);
  private eventService = inject(EventService);
  private bookingService = inject(BookingService);

  currentUser: User | null = null;
  isOrganizer = false;

  dashboardStats: DashboardStats | null = null;
  myEvents: Event[] = [];
  recentBookings: Booking[] = [];
  myTickets: Booking[] = [];
  upcomingEvents: Event[] = [];

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.isOrganizer = this.authService.isOrganizer;

    if (this.isOrganizer) {
      this.loadOrganizerData();
    } else {
      this.loadParticipantData();
    }
  }

  loadOrganizerData() {
    this.statsService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (err) => console.error('Error loading stats:', err)
    });

    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.myEvents = events.slice(0, 5);
      },
      error: (err) => console.error('Error loading events:', err)
    });

    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.recentBookings = bookings.slice(0, 10);
      },
      error: (err) => console.error('Error loading bookings:', err)
    });
  }

  loadParticipantData() {
    this.bookingService.getWallet().subscribe({
      next: (tickets) => {
        this.myTickets = tickets;
      },
      error: (err) => console.error('Error loading tickets:', err)
    });

    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.upcomingEvents = response.results.slice(0, 3);
      },
      error: (err) => console.error('Error loading events:', err)
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'confirmed': return 'CONFIRMÉ';
      case 'pending': return 'EN ATTENTE';
      case 'cancelled': return 'ANNULÉ';
      default: return status;
    }
  }
}
