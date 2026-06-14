import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Event, TicketTypeEvent } from '../../core/models/event.model';
import { BookingCreate } from '../../core/models/booking.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  event: Event | null = null;
  isLoading = true;
  isOrganizer = false;
  selectedTickets: { [key: number]: number } = {};
  totalAmount = 0;
  showCheckout = false;

  checkoutForm: FormGroup = this.fb.group({
    payment_method: ['orange_money', Validators.required],
    phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    items: this.fb.array([])
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isOrganizer = this.authService.isOrganizer;

    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
        this.initializeTicketQuantities();
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.isLoading = false;
        this.notificationService.showError('Événement non trouvé');
        this.router.navigate(['/events']);
      }
    });
  }

  initializeTicketQuantities() {
    if (this.event?.ticket_types) {
      this.event.ticket_types.forEach(ticket => {
        this.selectedTickets[ticket.id] = 0;
      });
    }
  }

  updateQuantity(ticketId: number, change: number) {
    const ticket = this.event?.ticket_types.find(t => t.id === ticketId);
    if (!ticket) return;

    const maxQuantity = Math.min(ticket.remaining, 6);
    const newQuantity = (this.selectedTickets[ticketId] || 0) + change;
    if (newQuantity >= 0 && newQuantity <= maxQuantity) {
      this.selectedTickets[ticketId] = newQuantity;
      this.calculateTotal();
    }
  }

  getQuantity(ticketId: number): number {
    return this.selectedTickets[ticketId] || 0;
  }

  calculateTotal() {
    this.totalAmount = 0;
    if (this.event?.ticket_types) {
      this.event.ticket_types.forEach(ticket => {
        this.totalAmount += (this.selectedTickets[ticket.id] || 0) * ticket.price;
      });
    }
  }

  getTotalItems(): number {
    return Object.values(this.selectedTickets).reduce((a, b) => a + b, 0);
  }

  proceedToCheckout() {
    if (this.getTotalItems() === 0) {
      this.notificationService.showError('Veuillez sélectionner au moins un billet');
      return;
    }

    if (!this.authService.isAuthenticated) {
      this.notificationService.showWarning('Veuillez vous connecter pour réserver');
      this.router.navigate(['/login']);

    return;
    }

    this.showCheckout = true;
    this.initCheckoutForm();
  }

  getMaxQuantity(ticket: TicketTypeEvent): number {
    return Math.min(ticket.remaining, 6);
  }
initCheckoutForm() {
  // Réinitialiser le formulaire
  this.checkoutForm = this.fb.group({
    payment_method: ['orange_money', Validators.required],
    phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    items: this.fb.array([])
  });

  const itemsArray = this.checkoutForm.get('items') as FormArray;

  if (this.event?.ticket_types) {
    this.event.ticket_types.forEach(ticket => {
      const quantity = this.selectedTickets[ticket.id] || 0;
      if (quantity > 0) {
        itemsArray.push(this.fb.group({
          ticket_type_id: [ticket.id],
          quantity: [quantity]
        }));
      }
    });
  }
}

  onPaymentMethodChange() {
    const method = this.checkoutForm.get('payment_method')?.value;
    const phoneControl = this.checkoutForm.get('phone_number');

    if (method === 'orange_money' || method === 'mtn_momo') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    } else {
      phoneControl?.clearValidators();
      phoneControl?.setValue('');
    }
    phoneControl?.updateValueAndValidity();
  }

  submitBooking() {
    if (this.checkoutForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs');
      return;
    }

    const bookingData: BookingCreate = {
      event_id: this.event!.id,
      payment_method: this.checkoutForm.value.payment_method,
      items: this.checkoutForm.value.items,
      phone_number: this.checkoutForm.value.phone_number || undefined
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (booking) => {
        this.notificationService.showSuccess('Réservation confirmée !');
        this.router.navigate(['/wallet']);
      },
      error: (error) => {
        console.error('Booking error:', error);
      }
    });
  }

  cancelCheckout() {
    this.showCheckout = false;
  }

  getProgressPercentage(): number {
    if (!this.event) return 0;
    return (this.event.tickets_sold / this.event.capacity) * 100;
  }
}
