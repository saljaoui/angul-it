import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  @Output() completed = new EventEmitter<ChallengeAnswer>();

  readonly expected = 'X4K9mP';
  typed = '';

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
