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

  // --- Computed Values ---

  // Is the current challenge answered correctly?
  // We ask the child component directly using ViewChild
  get canProceed(): boolean {
    if (this.currentChallenge === 'image-select')  return this.imageSelect?.isValid  ?? false;
    if (this.currentChallenge === 'math-equation') return this.mathEquation?.isValid ?? false;
    if (this.currentChallenge === 'text-input')    return this.textInput?.isValid    ?? false;
    return false;
  }

  get progress(): number {
    return Math.round((this.attempt.currentStage / this.attempt.totalStages) * 100);
  }

  // --- Lifecycle ---

  // ngOnInit runs once when the page loads
  ngOnInit(): void {
    // Try to load a saved attempt from localStorage
    const attempt = this.state.getAttempt();

    if (!attempt) {
      this.router.navigate(['/']);
      return;
    }

    // Save attempt to our variable and figure out which challenge to show
    this.attempt = attempt;
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }

  // --- Button Handlers ---

  // Called when user clicks the "Next" button
  onNext(): void {
    // Don't do anything if the challenge isn't completed yet
    if (!this.canProceed) return;

    // Tell the correct child component to submit its answer
    if (this.currentChallenge === 'image-select')  this.imageSelect.submit();
    if (this.currentChallenge === 'math-equation') this.mathEquation.submit();
    if (this.currentChallenge === 'text-input')    this.textInput.submit();
  }

  // Called when user clicks the "Previous" button
  onPrevious(): void {
    // Can't go back if we're already on the first stage
    if (this.attempt.currentStage === 0) return;

    // Tell the service to go back one stage (it saves to localStorage too)
    this.state.goToPreviousStage();

    // Reload the attempt and update which challenge to show
    this.attempt = this.state.getAttempt()!;
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }

  // Called by a child component when the user completes a challenge
  // The child emits (completed) event with the answer data
  onStageComplete(answer: ChallengeAnswer): void {
    // Save the answer and advance the stage in localStorage
    this.state.advanceStage(answer);

    // Reload the attempt to get the updated stage number and status
    this.attempt = this.state.getAttempt()!;

    // If all stages are done, go to the results page
    if (this.attempt.status === 'finished') {
      this.router.navigate(['/result']);
      return;
    }

    // Otherwise, show the next challenge
    this.currentChallenge = this.attempt.challengeOrder[this.attempt.currentStage];
  }
}
