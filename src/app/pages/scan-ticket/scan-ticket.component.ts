import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-scan-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-ticket.component.html',
  styleUrls: ['./scan-ticket.component.css']
})
export class ScanTicketComponent {
  private bookingService = inject(BookingService);
  private notificationService = inject(NotificationService);

  paymentRef = '';
  isLoading = false;
  ticketInfo: any = null;
  scanError: string | null = null;

  constructor() {
    this.bookingService = inject(BookingService);
    this.notificationService = inject(NotificationService);
  }

  validateTicket() {
    if (!this.paymentRef.trim()) {
      this.notificationService.showError('Veuillez entrer une référence');
      return;
    }

    this.isLoading = true;
    this.scanError = null;

    this.bookingService.verifyTicket(this.paymentRef).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.valid) {
          this.ticketInfo = result;
          this.notificationService.showSuccess('Billet valide !');
        } else {
          this.scanError = result.detail || 'Billet invalide';
          this.notificationService.showError('Billet invalide');
        }
      },
      error: () => {
        this.isLoading = false;
        this.scanError = 'Erreur lors de la vérification';
        this.notificationService.showError('Erreur de vérification');
      }
    });
  }

  resetScanner() {
    this.paymentRef = '';
    this.ticketInfo = null;
    this.scanError = null;
  }
}
