import { Component, inject, OnInit } from '@angular/core';
import { Footer } from '../../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Attempt } from '../../core/models/attempt.model';

@Component({
  selector: 'app-captcha',
  imports: [Footer, RouterLink],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class CaptchaComponent implements OnInit {
  private state = inject(StateService);
  attempt: Attempt | null = null;

  ngOnInit(): void {
    this.attempt = this.state.getAttempt();
    console.log(this.attempt);
  }
}