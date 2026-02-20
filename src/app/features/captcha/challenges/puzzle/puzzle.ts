import { Component, EventEmitter, Output } from '@angular/core';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';

@Component({
  selector: 'app-puzzle',
  imports: [],
  templateUrl: './puzzle.html',
  styleUrl: './puzzle.scss',
})
export class Puzzle {
  @Output() completed = new EventEmitter<ChallengeAnswer>();

  sliderComplete = false;

  get isValid(): boolean {
    return this.sliderComplete;
  }

  markComplete(): void {
    this.sliderComplete = true;
  }

  submit(): void {
    const correct = this.sliderComplete;
    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'puzzle',
      status: correct ? 'passed' : 'failed',
      correct,
      attempts: 1,
      answeredAt: new Date().toISOString(),
      data: {
        type: 'puzzle',
        completed: this.sliderComplete,
        timeRemainingSeconds: 0,
      },
    });
  }

}
