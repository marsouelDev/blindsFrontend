import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    password: ['', Validators.required]
  });

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', Validators.required],
    role: ['participant', Validators.required]
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
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    if (this.registerForm.value.password !== this.registerForm.value.password2) {
      this.notificationService.showError('Les mots de passe ne correspondent pas');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.notificationService.showSuccess('Inscription réussie !');
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
