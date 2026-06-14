# BlindEvents - Frontend

Plateforme de gestion d'événements avec billetterie en ligne, construite avec Angular 18.

## 🚀 Fonctionnalités

### Pour les participants

- **Exploration d'événements**: Découvrez des concerts, conférences, festivals et plus
- **Réservation facile**: Réservez vos billets en quelques clics
- **Paiement sécurisé**: Orange Money, MTN Mobile Money, carte bancaire
- **Portefeuille digital**: Accédez à tous vos billets depuis votre téléphone
- **Notifications**: Restez informé des mises à jour

### Pour les organisateurs

- **Création d'événements**: Créez et gérez vos événements facilement
- **Gestion des billets**: Définissez différents types de billets et tarifs
- **Dashboard statistique**: Suivez vos ventes et revenus en temps réel
- **Scanner de billets**: Vérifiez les billets à l'entrée avec QR code
- **Analytiques**: Visualisez les performances de vos événements

## 🛠️ Stack technique

- **Framework**: Angular 18.2.0
- **Langage**: TypeScript 5.5.2
- **Styling**: Bootstrap 5.3.3 + CSS custom
- **Icons**: RemixIcons 4.2.0
- **Notifications**: ngx-toastr 18.0.0
- **HTTP Client**: Angular HttpClient avec intercepteurs
- **Routing**: Angular Router avec guards
- **Backend API**: Django REST Framework (http://127.0.0.1:8000/api)

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- Backend Django API en cours d'exécution

## 🔧 Installation

1. **Cloner le projet**

   ```bash
   cd c:\Users\GIOVANNI CHARLES\Music\projet_sarah\local\frontend_blindsevent
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer l'API backend**
   - L'URL de l'API est configurée dans les services (http://127.0.0.1:8000/api)
   - Assurez-vous que le backend Django est en cours d'exécution

4. **Lancer le serveur de développement**
   ```bash
   npm start
   ```
   L'application sera accessible sur http://localhost:4200/

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/                  # Cœur de l'application
│   │   ├── guards/           # Guards de routage (auth, organizer, guest)
│   │   ├── interceptors/     # Intercepteurs HTTP (auth, error)
│   │   ├── models/           # Modèles TypeScript
│   │   │   ├── user.model.ts
│   │   │   ├── event.model.ts
│   │   │   ├── booking.model.ts
│   │   │   ├── ticket.model.ts
│   │   │   └── stats.model.ts
│   │   └── services/         # Services API
│   │       ├── auth.service.ts
│   │       ├── event.service.ts
│   │       ├── booking.service.ts
│   │       ├── ticket-type.service.ts
│   │       ├── stats.service.ts
│   │       └── notification.service.ts
│   ├── pages/                # Pages de l'application
│   │   ├── home/             # Page d'accueil
│   │   ├── auth/             # Authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/        # Dashboard utilisateur
│   │   ├── events/           # Liste des événements
│   │   ├── event-create/     # Création d'événement
│   │   ├── event-detail/     # Détails d'événement
│   │   ├── event-edit/       # Modification d'événement
│   │   ├── checkout/         # Paiement
│   │   ├── wallet/           # Portefeuille de billets
│   │   ├── ticket-detail/    # Détails de billet
│   │   ├── scan-ticket/      # Scanner de billets
│   │   ├── verify-ticket/    # Vérification de billets
│   │   └── profile/          # Profil utilisateur
│   ├── shared/              # Composants partagés
│   ├── app.config.ts        # Configuration de l'application
│   ├── app.routes.ts        # Routes de l'application
│   └── app.component.ts     # Composant racine
├── assets/                  # Assets statiques
├── index.html              # HTML principal
└── styles.css             # Styles globaux
```

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification:

- **Login**: POST `/api/accounts/login/`
- **Register**: POST `/api/accounts/register/`
- **Refresh Token**: POST `/api/accounts/refresh/`
- **Logout**: POST `/api/accounts/logout/`
- **Profile**: GET/PUT `/api/accounts/profile/`

Les tokens sont stockés dans localStorage et automatiquement rafraîchis lorsqu'ils expirent.

## 🛡️ Guards de routage

- **authGuard**: Protège les routes nécessitant une authentification
- **guestGuard**: Redirige les utilisateurs authentisés depuis les pages login/register
- **organizerGuard**: Restreint l'accès aux organisateurs uniquement

## 🎨 Design et Styling

Le projet utilise:

- **Bootstrap 5.3.3**: Framework CSS pour la mise en page responsive
- **RemixIcons 4.2.0**: Icônes modernes et cohérentes
- **CSS Variables**: Pour une gestion facile des couleurs et thèmes
- **Design System**: Cohérent avec des couleurs primaires (#6366f1) et secondaires (#ec4899)

## 📡 Services API

### AuthService

Gestion de l'authentification et des tokens JWT

### EventService

CRUD pour les événements et catégories

### BookingService

Gestion des réservations et paiements

### TicketTypeService

Gestion des types de billets

### StatsService

Statistiques pour les organisateurs

### NotificationService

Système de notifications toast avec ngx-toastr

## 🔧 Intercepteurs HTTP

### AuthInterceptor

- Ajoute automatiquement le token JWT aux requêtes
- Gère le rafraîchissement automatique des tokens expirés
- Redirige vers login en cas d'échec

### ErrorInterceptor

- Gère centraliséement les erreurs HTTP
- Affiche des notifications toast pour les erreurs
- Formate les messages d'erreur du backend

## 🚀 Build pour la production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`.

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests end-to-end
npm run e2e
```

## 📝 Configuration de l'API

L'URL de l'API backend est configurée dans chaque service:

- Base URL: `http://127.0.0.1:8000/api`

Pour modifier l'URL de l'API en production, mettez à jour les services dans `src/app/core/services/`.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- **Sarah Charles** - Développeur principal

## 🙏 Remerciements

- Angular Team pour le framework excellent
- Bootstrap pour le framework CSS
- RemixIcons pour les icônes magnifiques
- L'équipe Django REST Framework pour l'API backend
"# blindsFrontend" 
