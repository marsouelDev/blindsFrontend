import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-verify-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-ticket.component.html',
  styleUrls: ['./verify-ticket.component.css']
})
export class VerifyTicketComponent {
  paymentRef = '';
  isLoading = false;
  ticketInfo: any = null;
  error: string | null = null;

  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}

  verifyTicket() {
    if (!this.paymentRef.trim()) {
      this.notificationService.showError('Veuillez entrer une référence');
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.ticketInfo = null;

    this.bookingService.verifyTicket(this.paymentRef).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.valid) {
          this.ticketInfo = result;
          this.notificationService.showSuccess('Billet valide !');
        } else {
          this.error = result.detail || 'Billet invalide';
          this.notificationService.showError('Billet invalide');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Erreur lors de la vérification';
        this.notificationService.showError('Erreur de vérification');
      }
    });
  }
}
