import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { BookingCreate } from '../../core/models/booking.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  checkoutForm!: FormGroup;
  totalAmount = 75000;
  isLoading = false;
  step = 1;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      payment_method: ['orange_money', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      items: this.fb.array([])
    });
  }

  onPaymentMethodChange() {
    const method = this.checkoutForm.get('payment_method')?.value;
    const phoneControl = this.checkoutForm.get('phone_number');

    if (method === 'orange_money' || method === 'mtn_momo') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    } else {
      phoneControl?.clearValidators();
      phoneControl?.setValue('');
    }
    phoneControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading = true;
    this.step = 2;

    // Simulation de paiement
    setTimeout(() => {
      this.step = 3;
      setTimeout(() => {
        this.isLoading = false;
        this.notificationService.showSuccess('Paiement effectué avec succès !');
        this.router.navigate(['/wallet']);
      }, 1500);
    }, 2000);
  }
}
