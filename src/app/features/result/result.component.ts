import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Attempt, ChallengeAnswer, ImageSelectAnswer, MathEquationAnswer, TextInputAnswer } from '../../core/models/attempt.model';
import { Footer } from '../../shared/footer/footer';

interface StageRow {
  index: number;
  title: string;
  subtitle: string;
  status: 'passed' | 'failed';
  accuracy: number;
  time: string;
  logMessage: string;
  logTime: string;
}

@Component({
  selector: 'app-result',
  imports: [Footer, RouterLink],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class ResultComponent implements OnInit {
  private state = inject(StateService);
  private router = inject(Router);

  attempt!: Attempt;
  stages: StageRow[] = [];
  totalTime = '';
  finishedTime = '';

  get passedCount(): number {
    return this.attempt.answers.filter(a => a.correct).length;
  }

  get score(): number {
    return this.attempt.score;
  }

  // ✅ ring offset based on real score
  get ringOffset(): number {
    const circumference = 2 * Math.PI * 45; // 282.74
    return circumference * (1 - this.score / 100);
  }

  get verdict(): { title: string; sub: string; color: string } {
    if (this.score === 100) return {
      title: "You're Human.",
      sub: 'All challenges passed. Identity verified.',
      color: '#00ff41'
    };
    return {
      title: "You're a Robot.",
      sub: 'Not all challenges passed. Try again.',
      color: '#ff0040'
    };
  }

  ngOnInit(): void {
    const attempt = this.state.getAttempt();

    // Block direct access if challenge not finished
    if (!attempt || attempt.status !== 'finished') {
      this.router.navigate(['/captcha']);
      return;
    }

    this.attempt = attempt;
    this.totalTime = this.calcTotalTime();
    this.finishedTime = this.calcLogTime(attempt.answers.length - 1);
    this.stages = this.attempt.answers.map((a, i) => this.buildStageRow(a, i));
  }

  onRestart(): void {
    this.state.clearAttempt();
    this.state.createNewAttempt();
    this.router.navigate(['/captcha']);
  }

  private buildStageRow(answer: ChallengeAnswer, i: number): StageRow {
    const stageLabels: Record<string, { title: string; subtitle: string }> = {
      'image-select': { title: 'Image Selection', subtitle: 'Select all matching images' },
      'math-equation': { title: 'Math Challenge', subtitle: 'Solve the equation' },
      'text-input': { title: 'Text Verification', subtitle: 'Type the characters shown' },
      'puzzle': { title: 'Puzzle', subtitle: 'Complete the puzzle' },
    };

    return {
      index: i + 1,
      title: stageLabels[answer.type].title,
      subtitle: stageLabels[answer.type].subtitle,
      status: answer.correct ? 'passed' : 'failed',
      accuracy: answer.correct ? 100 : 0,
      time: this.calcStageTime(answer, i),
      logTime: this.calcLogTime(i),
      logMessage: this.buildLogMessage(answer),
    };
  }

  private buildLogMessage(answer: ChallengeAnswer): string {
    if (!answer.correct) return 'FAILED';

    switch (answer.data.type) {
      case 'image-select': {
        const d = answer.data as ImageSelectAnswer;
        return `PASSED — ${d.selectedIndexes.length}/${d.correctIndexes.length} correct selections`;
      }
      case 'math-equation': {
        const d = answer.data as MathEquationAnswer;
        return `PASSED — Correct answer: ${d.correctOption}`;
      }
      case 'text-input': {
        const d = answer.data as TextInputAnswer;
        return `PASSED — "${d.expected}" matched`;
      }
    }
  }

  private calcTotalTime(): string {
    const start = new Date(this.attempt.startedAt).getTime();
    const end = new Date(this.attempt.finishedAt!).getTime();
    const seconds = Math.floor((end - start) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  }

  private calcLogTime(index: number): string {
    const start = new Date(this.attempt.startedAt).getTime();
    const end = new Date(this.attempt.answers[index].answeredAt).getTime();
    const seconds = Math.floor((end - start) / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private calcStageTime(answer: ChallengeAnswer, i: number): string {
    const start = i === 0
      ? new Date(this.attempt.startedAt).getTime()
      : new Date(this.attempt.answers[i - 1].answeredAt).getTime();
    const end = new Date(answer.answeredAt).getTime();
    const seconds = Math.floor((end - start) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  }
}