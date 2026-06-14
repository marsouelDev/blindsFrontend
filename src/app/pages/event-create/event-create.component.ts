import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { TicketTypeService } from '../../core/services/ticket-type.service';
import { NotificationService } from '../../core/services/notification.service';
import { Category } from '../../core/models/event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private ticketTypeService = inject(TicketTypeService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  categories: Category[] = [];
  isLoading = false;
  currentStep = 1;

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    category_id: [null],
    is_online: [false],
    online_link: [''],
    status: ['draft']
  });

  ticketTypes: FormArray = this.fb.array([]);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  addTicketType() {
    this.ticketTypes.push(this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      sale_start: [''],
      sale_end: ['']
    }));
  }

  removeTicketType(index: number) {
    this.ticketTypes.removeAt(index);
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    Object.keys(this.eventForm.value).forEach(key => {
      const value = this.eventForm.value[key as keyof typeof this.eventForm.value];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    this.eventService.createEvent(formData).subscribe({
      next: (event) => {
        const ticketTypesValue = this.ticketTypes.value;
        if (ticketTypesValue.length === 0) {
          this.notificationService.showSuccess('Événement créé avec succès !');
          this.router.navigate(['/events', event.id]);
          this.isLoading = false;
          return;
        }

        let completed = 0;
        ticketTypesValue.forEach((ticketType: any) => {
          this.ticketTypeService.createTicketType({
            ...ticketType,
            event: event.id
          }).subscribe({
            next: () => {
              completed++;
              if (completed === ticketTypesValue.length) {
                this.notificationService.showSuccess('Événement créé avec succès !');
                this.router.navigate(['/events', event.id]);
                this.isLoading = false;
              }
            },
            error: () => {
              this.isLoading = false;
            }
          });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  nextStep() {
    if (this.currentStep === 1 && this.eventForm.valid) {
      this.currentStep++;
    } else if (this.currentStep === 1) {
      this.notificationService.showError('Veuillez remplir les informations de base');
    }
  }

  prevStep() {
    this.currentStep--;
  }
}
