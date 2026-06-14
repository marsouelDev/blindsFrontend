import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.detail || error.error?.message || 'Requête invalide';
            if (typeof error.error === 'object') {
              const firstError = Object.values(error.error)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              }
            }
            break;
          case 403:
            errorMessage = 'Vous n\'avez pas les droits nécessaires';
            break;
          case 404:
            errorMessage = 'Ressource non trouvée';
            break;
          case 500:
            errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
            break;
          default:
            errorMessage = error.error?.detail || error.message || 'Erreur inconnue';
        }
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
