import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { EventService } from '../../core/services/event.service';
import { DashboardStats } from '../../core/models/stats.model';
import { Event } from '../../core/models/event.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private statsService = inject(StatsService);
  private eventService = inject(EventService);
  
  currentUser: User | null = null;
  dashboardStats: DashboardStats | null = null;
  myEvents: Event[] = [];
  isLoading = true;

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.loadData();
  }
  
  loadData() {
    this.isLoading = true;
    
    this.statsService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loadMockData();
      }
    });
    
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.myEvents = events;
      },
      error: (err) => console.error('Error loading events:', err)
    });
  }

  loadMockData() {
    this.dashboardStats = {
      total_events: 3,
      active_events: 2,
      total_bookings: 45,
      total_revenue: 750000,
      total_sold: 87,
      events_stats: [],
      payment_split: {
        orange_money: { amount: 487500, pct: 65 },
        mtn_momo: { amount: 262500, pct: 35 }
      }
    };
    this.isLoading = false;
  }

  getTotalRevenue(): number {
    return this.dashboardStats?.total_revenue || 0;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
  }
}