import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastr = inject(ToastrService);

  showSuccess(message: string, title: string = 'Succès') {
    this.toastr.success(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true
    });
  }

  showError(message: string, title: string = 'Erreur') {
    this.toastr.error(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      progressBar: true
    });
  }

  showWarning(message: string, title: string = 'Attention') {
    this.toastr.warning(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true
    });
  }

  showInfo(message: string, title: string = 'Information') {
    this.toastr.info(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true
    });
  }
}
