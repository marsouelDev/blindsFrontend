import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private eventService = inject(EventService);
  events: Event[] = [];
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events = response.results;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
