import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DecimalPipe, DatePipe]
})
export class AppComponent {
  title = 'layaway-app'

 
}
