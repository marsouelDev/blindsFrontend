import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  private bookingService = inject(BookingService);
  private notificationService = inject(NotificationService);

  tickets: Booking[] = [];
  isLoading = true;
  filter: 'all' | 'upcoming' | 'past' = 'upcoming';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.bookingService.getWallet().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.isLoading = false;
      }
    });
  }

  getFilteredTickets(): Booking[] {
    const now = new Date();
    return this.tickets.filter(ticket => {
      const eventDate = new Date(ticket.event_date);
      if (this.filter === 'upcoming') {
        return eventDate >= now;
      } else if (this.filter === 'past') {
        return eventDate < now;
      }
      return true;
    });
  }

  setFilter(filter: 'all' | 'upcoming' | 'past') {
    this.filter = filter;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  downloadTicket(ticket: Booking) {
    this.bookingService.verifyTicket(ticket.payment_ref).subscribe({
      next: (result) => {
        if (result.valid) {
          this.notificationService.showSuccess('Préparation du billet...');
        }
      },
      error: () => {
        this.notificationService.showError('Erreur lors du téléchargement');
      }
    });
  }
}
