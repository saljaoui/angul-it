import { Component, inject } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-home',
  imports: [Navbar, Footer, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class HomeComponent {
  private state = inject(StateService)

  startChallenge() {
    this.state.createNewAttempt();
  }
}
