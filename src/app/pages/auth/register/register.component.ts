import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isLoading = false;

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', Validators.required],
    role: ['participant', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs correctement');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.password2) {
      this.notificationService.showError('Les mots de passe ne correspondent pas');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.notificationService.showSuccess('Inscription réussie ! Bienvenue sur BlindEvents');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
