import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { StateService } from '../../../../core/services/state.service';

const WORDS = ['X4K9mP', 'R7Tz2W', 'B3Qn8L', 'Y6Kx4J', 'M2Pw5N', 'F9Rc1V'];

@Component({
  selector: 'app-text-input',
  imports: [FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements OnInit {
  @Output() completed = new EventEmitter<ChallengeAnswer>();
  private state = inject(StateService);

  typed = '';
  wordIndex: number = Math.floor(Math.random() * WORDS.length);

  get word(): string {
    return WORDS[this.wordIndex];
  }

  get isValid(): boolean {
    return this.typed.trim().length > 0;
  }

  ngOnInit(): void {
    const attempt = this.state.getAttempt();
    const previous = attempt?.answers.find(a => a.stage === attempt.currentStage);

    if (previous?.data.type === 'text-input') {
      this.wordIndex = previous.data.wordIndex; // ✅ restore same word
      this.typed = previous.data.typed;         // ✅ restore typed text
    }
  }

  submit(): void {
    if (!this.isValid) return;

    const correct = this.typed.trim() === this.word;

    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'text-input',
      status: correct ? 'passed' : 'failed',
      correct,
      attempts: 1,
      stage: this.state.getAttempt()!.currentStage,
      answeredAt: new Date().toISOString(),
      data: {
        type: 'text-input',
        wordIndex: this.wordIndex,
        typed: this.typed,
        expected: this.word,
      },
    });
  }
}