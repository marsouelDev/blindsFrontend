import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  currentUser: User | null = null;
  isOrganizer = false;
  isLoading = false;
  isEditing = false;
  today = new Date();

  profileForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    profile: this.fb.group({
      phone: [''],
      bio: ['']
    })
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isOrganizer = user.profile?.role === 'organizer';
        this.profileForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile: {
            phone: user.profile?.phone || '',
            bio: user.profile?.bio || ''
          }
        });
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadProfile();
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.authService.updateProfile(this.profileForm.value as any).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.notificationService.showSuccess('Profil mis à jour avec succès');
        this.isEditing = false;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
