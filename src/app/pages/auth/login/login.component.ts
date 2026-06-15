import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isRegisterMode = false;
  isLoading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', Validators.required],
    role: ['participant', Validators.required],
  });

  setMode(mode: boolean) {
    this.isRegisterMode = mode;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.notificationService.showSuccess('Connexion réussie !');
        // ✅ Redirige selon le rôle
        if (this.authService.isOrganizer) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.notificationService.showError(
            'Serveur injoignable, réessayez dans 30 secondes.',
          );
        } else if (err.status === 401) {
          this.notificationService.showError('Identifiants incorrects.');
        } else {
          this.notificationService.showError(
            err.error?.detail || 'Erreur de connexion.',
          );
        }
      },
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    if (
      this.registerForm.value.password !== this.registerForm.value.password2
    ) {
      this.notificationService.showError(
        'Les mots de passe ne correspondent pas',
      );
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.notificationService.showSuccess('Inscription réussie !');
        if (this.authService.isOrganizer) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.notificationService.showError(
            'Serveur injoignable, réessayez dans 30 secondes.',
          );
        } else if (err.status === 400) {
          const errors = err.error;
          const messages = Object.entries(errors)
            .map(
              ([field, msgs]: [string, any]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`,
            )
            .join(' | ');
          this.notificationService.showError(messages || 'Données invalides.');
        } else {
          this.notificationService.showError(
            err.error?.detail || 'Erreur inscription.',
          );
        }
      },
    });
  }
}
