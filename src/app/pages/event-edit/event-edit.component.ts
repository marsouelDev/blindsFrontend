import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { TicketTypeService } from '../../core/services/ticket-type.service';
import { NotificationService } from '../../core/services/notification.service';
import { Category, Event } from '../../core/models/event.model';
import { TicketType } from '../../core/models/ticket.model';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private ticketTypeService = inject(TicketTypeService);
  private notificationService = inject(NotificationService);

  eventId!: number;
  event: Event | null = null;
  categories: Category[] = [];
  ticketTypes: TicketType[] = [];
  isLoading = true;
  isSaving = false;

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    category_id: [null as number | null],
    is_online: [false],
    online_link: [''],
    status: ['draft']
  });

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData() {
    Promise.all([
      this.eventService.getEvent(this.eventId).toPromise(),
      this.eventService.getCategories().toPromise(),
      this.ticketTypeService.getTicketTypesByEvent(this.eventId).toPromise()
    ]).then(([event, categories, ticketTypes]) => {
      this.event = event!;
      this.categories = categories || [];
      this.ticketTypes = ticketTypes || [];
      this.populateForm();
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
      this.notificationService.showError('Erreur lors du chargement');
    });
  }

  populateForm() {
    if (this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        location: this.event.location,
        date: this.event.date,
        time: this.event.time,
        capacity: this.event.capacity,
        category_id: this.event.category?.id ?? null,
        is_online: this.event.is_online,
        online_link: this.event.online_link || '',
        status: this.event.status
      });
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    Object.keys(this.eventForm.value).forEach(key => {
      const value = this.eventForm.value[key as keyof typeof this.eventForm.value];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Événement mis à jour avec succès');
        this.router.navigate(['/events', this.eventId]);
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  publishEvent() {
    this.eventService.publishEvent(this.eventId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Événement publié !');
        this.loadData();
      },
      error: (err) => console.error('Error publishing:', err)
    });
  }

  cancelEvent() {
    if (confirm('Êtes-vous sûr de vouloir annuler cet événement ?')) {
      this.eventService.cancelEvent(this.eventId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Événement annulé');
          this.loadData();
        },
        error: (err) => console.error('Error cancelling:', err)
      });
    }
  }
}
