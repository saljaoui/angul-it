import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Attempt, ChallengeAnswer, ChallengeType } from '../../core/models/attempt.model';
import { ImageSelect } from './challenges/image-select/image-select';
import { MathEquation } from './challenges/math-equation/math-equation';
import { TextInput } from './challenges/text-input/text-input';
import { Puzzle } from './challenges/puzzle/puzzle';

@Component({
  selector: 'app-captcha',
  imports: [Footer, RouterLink, DecimalPipe, ImageSelect, MathEquation, TextInput, Puzzle],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class CaptchaComponent implements OnInit {
  private state = inject(StateService);
  private router = inject(Router);

  // ← fixes "Property 'currentChallenge' does not exist"
  currentChallenge!: ChallengeType;
  attempt!: Attempt;

  // ← fixes "Element implicitly has 'any' type" for challengeTitles
  challengeTitles: Record<ChallengeType, string> = {
    'image-select': 'Select all matching images',
    'math-equation': 'Solve the equation',
    'text-input': 'Type the characters shown',
    'puzzle': 'Complete the puzzle'
  };

  // ViewChild refs for calling submit() on each child
  @ViewChild(ImageSelect) imageSelect!: ImageSelect;
  @ViewChild(MathEquation) mathEquation!: MathEquation;
  @ViewChild(TextInput) textInput!: TextInput;
  @ViewChild(Puzzle) puzzle!: Puzzle;

  // ← fixes "Property 'canProceed' does not exist"
  get canProceed(): boolean {
    switch (this.currentChallenge) {
      case 'image-select': return this.imageSelect?.isValid ?? false;
      case 'math-equation': return this.mathEquation?.isValid ?? false;
      case 'text-input': return this.textInput?.isValid ?? false;
      case 'puzzle': return this.puzzle?.isValid ?? false;
      default: return false;
    }
  }

  // ← fixes "Property 'progress' does not exist"
  get progress(): number {
    return Math.round((this.attempt.currentStage / this.attempt.totalStages) * 100);
  }

  ngOnInit(): void {
    this.attempt = this.state.getAttempt()!;
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }

  // ← fixes "Property 'onNext' does not exist"
  onNext(): void {
    switch (this.currentChallenge) {
      case 'image-select': this.imageSelect.submit(); break;
      case 'math-equation': this.mathEquation.submit(); break;
      case 'text-input': this.textInput.submit(); break;
      case 'puzzle': this.puzzle.submit(); break;
    }
  }

  // ← fixes "Property 'onPrevious' does not exist"
  onPrevious(): void {
    if (this.attempt.currentStage > 0) {
      this.attempt.currentStage--;
      this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
    }
  }

  // ← fixes "Property 'onStageComplete' does not exist"
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
