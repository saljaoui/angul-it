import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { StateService } from '../../../../core/services/state.service';

interface MathQuestion {
  display: string;
  options: number[];
  answer: number;
}

const QUESTIONS: MathQuestion[] = [
  { display: '17 × 4 − 12 = ?', options: [55, 56, 57, 60], answer: 56 },
  { display: '8 × 9 − 15 = ?',  options: [55, 57, 58, 60], answer: 57 },
  { display: '6 × 7 + 3 = ?',   options: [42, 44, 45, 50], answer: 45 },
  { display: '12 × 5 − 8 = ?',  options: [50, 52, 54, 60], answer: 52 },
];

@Component({
  selector: 'app-math-equation',
  imports: [FormsModule],
  templateUrl: './math-equation.html',
  styleUrl: './math-equation.scss',
})
export class MathEquation implements OnInit {
  @Output() completed = new EventEmitter<ChallengeAnswer>();
  private state = inject(StateService);

  questionIndex: number = Math.floor(Math.random() * QUESTIONS.length);
  selectedOption: number | null = null;

  get question(): MathQuestion {
    return QUESTIONS[this.questionIndex];
  }

  ngOnInit(): void {
    const attempt = this.state.getAttempt();
    const previous = attempt?.answers.find(a => a.stage === attempt.currentStage);

    if (previous?.data.type === 'math-equation') {
      this.questionIndex = previous.data.questionIndex;
      this.selectedOption = previous.data.selectedOption;
    }
  }

  get isValid(): boolean {
    return this.selectedOption !== null;
  }

  submit(): void {
    if (this.selectedOption === null) return;

    const correct = this.selectedOption === this.question.answer;

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
        questionIndex: this.questionIndex,
        selectedOption: this.selectedOption,
        correctOption: this.question.answer,
        timeRemainingSeconds: 0,
      },
    });
  }
}
