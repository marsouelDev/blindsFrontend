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
  styleUrls: ['./event-create.component.css']
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
    online_link: ''
  };

  ticketData: any[] = [
    { name: 'Standard', price: 5000, quantity: 100 }
  ];

  publishMode = 'draft';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    console.log('Chargement des catégories...');
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        console.log('Catégories chargées:', categories);
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.categories = [
          { id: 1, name: 'Musique', slug: 'musique' },
          { id: 2, name: 'Gala', slug: 'gala' },
          { id: 3, name: 'Culture', slug: 'culture' }
        ];
      }
    });
  }

  nextStep() {
    console.log('Step suivant, actuel:', this.currentStep);
    
    if (this.currentStep === 1) {
      // Validation étape 1
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
      
      console.log('Étape 1 validée');
      this.currentStep = 2;
    } 
    else if (this.currentStep === 2) {
      if (this.ticketData.length === 0) {
        this.notificationService.showError('Ajoutez au moins un type de billet');
        return;
      }
      
      // Vérifier chaque billet
      for (let i = 0; i < this.ticketData.length; i++) {
        const ticket = this.ticketData[i];
        if (!ticket.name) {
          this.notificationService.showError(`Billet ${i+1}: Nom requis`);
          return;
        }
        if (ticket.price <= 0) {
          this.notificationService.showError(`Billet ${i+1}: Prix doit être supérieur à 0`);
          return;
        }
        if (ticket.quantity <= 0) {
          this.notificationService.showError(`Billet ${i+1}: Quantité doit être supérieure à 0`);
          return;
        }
      }
      
      console.log('Étape 2 validée');
      this.currentStep = 3;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addTicketType() {
    this.ticketData.push({ name: 'Nouveau billet', price: 5000, quantity: 50 });
  }

  removeTicketType(index: number) {
    if (this.ticketData.length > 1) {
      this.ticketData.splice(index, 1);
    } else {
      this.notificationService.showWarning('Vous devez avoir au moins un type de billet');
    }
  }

  onSubmit() {
    console.log('=== DÉBUT CRÉATION ÉVÉNEMENT ===');
    console.log('Données événement:', this.eventData);
    console.log('Types de billets:', this.ticketData);
    console.log('Mode publication:', this.publishMode);
    
    // Validation finale
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
    if (this.ticketData.length === 0) {
      this.notificationService.showError('Ajoutez au moins un type de billet');
      return;
    }

    this.isLoading = true;
    
    // Construire FormData
    const formData = new FormData();
    formData.append('title', this.eventData.title);
    formData.append('description', this.eventData.description);
    formData.append('location', this.eventData.location);
    formData.append('date', this.eventData.date);
    formData.append('time', this.eventData.time);
    formData.append('capacity', this.eventData.capacity.toString());
    formData.append('status', this.publishMode);
    
    if (this.eventData.category_id) {
      formData.append('category_id', this.eventData.category_id.toString());
    }
    if (this.eventData.is_online) {
      formData.append('is_online', 'true');
      if (this.eventData.online_link) {
        formData.append('online_link', this.eventData.online_link);
      }
    } else {
      formData.append('is_online', 'false');
    }

    // Afficher les données envoyées
    console.log('FormData envoyé:');
    (formData as any).forEach((value: any, key: string) => {
      console.log(`  ${key}: ${value}`);
    });

    // Appel API
    this.eventService.createEvent(formData).subscribe({
      next: (event) => {
        console.log('✅ Événement créé avec succès:', event);
        
        // Créer les billets
        if (this.ticketData.length === 0) {
          this.notificationService.showSuccess('Événement créé avec succès !');
          this.router.navigate(['/events', event.id]);
          this.isLoading = false;
          return;
        }
        
        let completed = 0;
        let hasError = false;
        
        this.ticketData.forEach((ticket, index) => {
          console.log(`Création billet ${index + 1}:`, ticket);
          
          this.ticketTypeService.createTicketType({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            event: event.id
          }).subscribe({
            next: () => {
              completed++;
              console.log(`Billet ${index + 1} créé (${completed}/${this.ticketData.length})`);
              
              if (completed === this.ticketData.length && !hasError) {
                this.notificationService.showSuccess('Événement et billets créés avec succès !');
                this.router.navigate(['/events', event.id]);
                this.isLoading = false;
              }
            },
            error: (err) => {
              console.error(`❌ Erreur création billet ${index + 1}:`, err);
              hasError = true;
              this.isLoading = false;
              this.notificationService.showError('Erreur lors de la création des billets');
            }
          });
        });
      },
      error: (err) => {
        console.error('❌ Erreur création événement:', err);
        this.isLoading = false;
        
        // Message d'erreur plus précis
        if (err.status === 0) {
          this.notificationService.showError('Impossible de contacter le serveur. Vérifiez que le backend est en ligne.');
        } else if (err.status === 401) {
          this.notificationService.showError('Non authentifié. Veuillez vous reconnecter.');
        } else if (err.status === 403) {
          this.notificationService.showError('Vous n\'avez pas les droits pour créer un événement.');
        } else {
          this.notificationService.showError(err.error?.detail || 'Erreur lors de la création');
        }
      }
    });
  }
}