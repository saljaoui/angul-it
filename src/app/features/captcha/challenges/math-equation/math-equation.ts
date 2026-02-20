import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { StateService } from '../../../../core/services/state.service';

@Component({
  selector: 'app-math-equation',
  imports: [FormsModule],
  templateUrl: './math-equation.html',
  styleUrl: './math-equation.scss',
})
export class MathEquation implements OnInit {
  @Output() completed = new EventEmitter<ChallengeAnswer>();
  private state = inject(StateService);

  selectedOption: number | null = null;
  readonly correctOption = 56;

  ngOnInit(): void {
    const attempt = this.state.getAttempt();
    const previous = attempt?.answers.find(a => a.stage === attempt.currentStage);

    if (previous?.data.type === 'math-equation') {
      this.selectedOption = previous.data.selectedOption;
    }
  }

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
      stage: this.state.getAttempt()!.currentStage,
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
