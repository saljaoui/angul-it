import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';

@Component({
  selector: 'app-math-equation',
  imports: [FormsModule],
  templateUrl: './math-equation.html',
  styleUrl: './math-equation.scss',
})
export class MathEquation {
  @Output() completed = new EventEmitter<ChallengeAnswer>();

  selectedOption: number | null = null;
  readonly correctOption = 56;

  get isValid(): boolean {
    return this.selectedOption !== null;
  }

  submit(): void {
    if (this.selectedOption === null) {
      return;
    }

    const correct = this.selectedOption === this.correctOption;
    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'math-equation',
      status: correct ? 'passed' : 'failed',
      correct,
      attempts: 1,
      answeredAt: new Date().toISOString(),
      data: {
        type: 'math-equation',
        selectedOption: this.selectedOption,
        correctOption: this.correctOption,
        timeRemainingSeconds: 0,
      },
    });
  }
}
