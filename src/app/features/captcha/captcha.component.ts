import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Attempt, ChallengeAnswer, ChallengeType } from '../../core/models/attempt.model';
import { ImageSelect } from './challenges/image-select/image-select';
import { MathEquation } from './challenges/math-equation/math-equation';
import { TextInput } from './challenges/text-input/text-input';

@Component({
  selector: 'app-captcha',
  imports: [Footer, RouterLink, DecimalPipe, ImageSelect, MathEquation, TextInput],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class CaptchaComponent implements OnInit {
  
  private state = inject(StateService);
  private router = inject(Router);    

  currentChallenge!: ChallengeType;
  attempt!: Attempt;

  challengeTitles: Record<ChallengeType, string> = {
    'image-select': 'Select all matching images',
    'math-equation': 'Solve the equation',
    'text-input': 'Type the characters shown',
  };

  @ViewChild(ImageSelect) imageSelect!: ImageSelect;
  @ViewChild(MathEquation) mathEquation!: MathEquation;
  @ViewChild(TextInput) textInput!: TextInput;

  get canProceed(): boolean {
    if (this.currentChallenge === 'image-select')  return this.imageSelect?.isValid  ?? false;
    if (this.currentChallenge === 'math-equation') return this.mathEquation?.isValid ?? false;
    if (this.currentChallenge === 'text-input')    return this.textInput?.isValid    ?? false;
    return false;
  }

  get progress(): number {
    return Math.round((this.attempt.currentStage / this.attempt.totalStages) * 100);
  }

  ngOnInit(): void {
    const attempt = this.state.getAttempt();

    if (!attempt) {
      this.router.navigate(['/']);
      return;
    }

    this.attempt = attempt;
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }

  onNext(): void {
    if (!this.canProceed) return;

    if (this.currentChallenge === 'image-select')  this.imageSelect.submit();
    if (this.currentChallenge === 'math-equation') this.mathEquation.submit();
    if (this.currentChallenge === 'text-input')    this.textInput.submit();
  }

  onPrevious(): void {
    if (this.attempt.currentStage === 0) return;

    this.state.goToPreviousStage();

    this.attempt = this.state.getAttempt()!;
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }

  onStageComplete(answer: ChallengeAnswer): void {
    this.state.advanceStage(answer);

    this.attempt = this.state.getAttempt()!;

    if (this.attempt.status === 'finished') {
      this.router.navigate(['/result']);
      return;
    }

    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }
}
