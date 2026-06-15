import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { TicketTypeService } from '../../core/services/ticket-type.service';
import { NotificationService } from '../../core/services/notification.service';
import { Category } from '../../core/models/event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
  private eventService = inject(EventService);
  private ticketTypeService = inject(TicketTypeService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  categories: Category[] = [];
  isLoading = false;
  currentStep = 1;

  eventData = {
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: 0,
    category_id: null as number | null,
    is_online: false,
    online_link: '',
  };

  ticketData: any[] = [{ name: 'Standard', price: 5000, quantity: 100 }];

  publishMode = 'draft';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.categories = [
          { id: 1, name: 'Musique', slug: 'musique' },
          { id: 2, name: 'Gala', slug: 'gala' },
          { id: 3, name: 'Culture', slug: 'culture' },
        ];
      },
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.eventData.title) {
        this.notificationService.showError('Titre requis');
        return;
      }
      if (!this.eventData.description) {
        this.notificationService.showError('Description requise');
        return;
      }
      if (!this.eventData.location) {
        this.notificationService.showError('Lieu requis');
        return;
      }
      if (!this.eventData.date) {
        this.notificationService.showError('Date requise');
        return;
      }
      if (!this.eventData.time) {
        this.notificationService.showError('Heure requise');
        return;
      }
      if (this.eventData.capacity <= 0) {
        this.notificationService.showError('Capacité doit être supérieure à 0');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (this.ticketData.length === 0) {
        this.notificationService.showError('Ajoutez au moins un billet');
        return;
      }
      for (let i = 0; i < this.ticketData.length; i++) {
        const t = this.ticketData[i];
        if (!t.name) {
          this.notificationService.showError(`Billet ${i + 1}: Nom requis`);
          return;
        }
        if (t.price <= 0) {
          this.notificationService.showError(`Billet ${i + 1}: Prix invalide`);
          return;
        }
        if (t.quantity <= 0) {
          this.notificationService.showError(
            `Billet ${i + 1}: Quantité invalide`,
          );
          return;
        }
      }
      this.currentStep = 3;
    }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  addTicketType() {
    this.ticketData.push({ name: 'Nouveau billet', price: 5000, quantity: 50 });
  }

  removeTicketType(index: number) {
    if (this.ticketData.length > 1) {
      this.ticketData.splice(index, 1);
    } else {
      this.notificationService.showWarning(
        'Vous devez avoir au moins un type de billet',
      );
    }
  }

  onSubmit() {
    this.isLoading = true;

    // ✅ Payload JSON (plus de FormData)
    const payload: any = {
      title: this.eventData.title,
      description: this.eventData.description,
      location: this.eventData.location,
      date: this.eventData.date,
      time: this.eventData.time,
      capacity: Number(this.eventData.capacity),
      status: this.publishMode,
      is_online: this.eventData.is_online,
    };

    if (this.eventData.category_id) {
      payload.category_id = Number(this.eventData.category_id);
    }
    if (this.eventData.is_online && this.eventData.online_link) {
      payload.online_link = this.eventData.online_link;
    }

    console.log('Payload JSON envoyé:', JSON.stringify(payload));

    this.eventService.createEvent(payload).subscribe({
      next: (event) => {
        console.log('✅ Événement créé:', event);

        let completed = 0;
        let hasError = false;

        this.ticketData.forEach((ticket, index) => {
          this.ticketTypeService
            .createTicketType({
              name: ticket.name,
              price: Number(ticket.price),
              quantity: Number(ticket.quantity),
              event: event.id,
            })
            .subscribe({
              next: () => {
                completed++;
                if (completed === this.ticketData.length && !hasError) {
                  this.notificationService.showSuccess(
                    'Événement et billets créés avec succès !',
                  );
                  this.router.navigate(['/events', event.id]);
                  this.isLoading = false;
                }
              },
              error: (err) => {
                console.error(
                  `❌ Erreur billet ${index + 1}:`,
                  JSON.stringify(err.error),
                );
                hasError = true;
                this.isLoading = false;
                this.notificationService.showError(
                  `Erreur billet: ${JSON.stringify(err.error)}`,
                );
              },
            });
        });
      },
      error: (err) => {
        console.error('❌ Erreur backend brute:', JSON.stringify(err.error));
        this.isLoading = false;

        if (err.status === 0) {
          this.notificationService.showError('Serveur injoignable.');
        } else if (err.status === 401) {
          this.notificationService.showError(
            'Non authentifié. Reconnectez-vous.',
          );
        } else if (err.status === 403) {
          this.notificationService.showError('Droits insuffisants.');
        } else if (err.status === 400) {
          const errors = err.error;
          const messages = Object.entries(errors)
            .map(
              ([field, msgs]: [string, any]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`,
            )
            .join(' | ');
          console.error('Champs rejetés par Django:', messages);
          this.notificationService.showError(messages || 'Données invalides');
        } else {
          this.notificationService.showError(
            err.error?.detail || 'Erreur inconnue',
          );
        }
      },
    });
  }
}
