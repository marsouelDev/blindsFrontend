import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BlindEvents';
  private http = inject(HttpClient);

  ngOnInit() {
    // Ping silencieux pour réveiller le serveur Render dès le démarrage
    this.http
      .get('https://blindsevent-api.onrender.com/api/events/')
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }
}
