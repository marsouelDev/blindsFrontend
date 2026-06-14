import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  ticket: Booking | null = null;
  isLoading = true;
  qrCodeData = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket(id);
  }

  loadTicket(id: number) {
    this.bookingService.getBooking(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.qrCodeData = ticket.payment_ref;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ticket:', error);
        this.isLoading = false;
      }
    });
  }

  downloadTicket() {
    // Simuler le téléchargement du billet
    const element = document.createElement('a');
    const content = this.generateTicketHTML();
    const blob = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(blob);
    element.download = `billet-${this.ticket?.payment_ref}.html`;
    element.click();
  }

  generateTicketHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><title>Billet ${this.ticket?.payment_ref}</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1>Big Shot Events</h1>
        <h2>${this.ticket?.event_title}</h2>
        <p>Date: ${this.ticket?.event_date}</p>
        <p>Lieu: ${this.ticket?.event_location}</p>
        <p>Référence: ${this.ticket?.payment_ref}</p>
        <div style="margin-top: 20px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.qrCodeData}" alt="QR Code">
        </div>
      </body>
      </html>
    `;
  }
}
