import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { StateService } from '../../../../core/services/state.service';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements OnInit {
  @Output() completed = new EventEmitter<ChallengeAnswer>();
  private state = inject(StateService);

  readonly expected = 'X4K9mP';
  typed = '';

  ngOnInit(): void {
    const attempt = this.state.getAttempt();
    const previous = attempt?.answers.find(a => a.stage === attempt.currentStage);

    if (previous?.data.type === 'text-input') {
      this.typed = previous.data.typed;
    }
  }
  get isValid(): boolean {
    return this.typed.trim().length > 0;
  }

  submit(): void {
    const trimmed = this.typed.trim();
    const correct = trimmed === this.expected;
    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'text-input',
      status: correct ? 'passed' : 'failed',
      correct,
      attempts: 1,
      answeredAt: new Date().toISOString(),
      data: {
        type: 'text-input',
        typed: trimmed,
        expected: this.expected,
      },
      stage:2,
    });
  }
}
