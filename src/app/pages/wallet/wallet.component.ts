import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
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

  tickets: Booking[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.bookingService.getWallet().subscribe({
      next: (tickets) => {
        this.tickets = tickets.filter(t => t.status === 'confirmed');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.isLoading = false;
      }
    });
  }
}
