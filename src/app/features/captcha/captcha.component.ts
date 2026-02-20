import { Component, inject, OnInit } from '@angular/core';
import { Footer } from '../../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Attempt } from '../../core/models/attempt.model';
import { ImageSelect } from './challenges/image-select/image-select';
import { MathEquation } from './challenges/math-equation/math-equation';
import { TextInput } from './challenges/text-input/text-input';
import { Puzzle } from './challenges/puzzle/puzzle';

@Component({
  selector: 'app-captcha',
  imports: [Footer, RouterLink, ImageSelect, MathEquation, TextInput, Puzzle],
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

progress(): number {
  const p = this.attempt?.score ?? 0;
  return p;
}
}