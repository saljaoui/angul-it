import { Injectable } from '@angular/core';
import { Attempt, ChallengeAnswer, ChallengeType } from '../models/attempt.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly STORAGE_KEY = 'angul-it:attempt';

  createNewAttempt(): Attempt {
    const attempt: Attempt = {
      id: crypto.randomUUID(),
      status: 'started',
      currentStage: 0,
      totalStages: 4,
      score: 0,
      startedAt: new Date().toISOString(),
      challengeOrder: this.generateChallengeOrder(),
      answers: [],
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempt));
    return attempt;
  }

  getAttempt(): Attempt | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attempt) : null;
  }

  advanceStage(answer: ChallengeAnswer): Attempt | null {
    const attempt = this.getAttempt();
    if (!attempt) {
      return null;
    }

    attempt.answers = [...attempt.answers, answer];

    if (answer.correct) {
      const increment = Math.round(100 / attempt.totalStages);
      attempt.score = Math.min(100, attempt.score + increment);
    }

    if (attempt.currentStage < attempt.totalStages - 1) {
      attempt.currentStage += 1;
    } else {
      attempt.status = 'finished';
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempt));
    return attempt;
  }

  clearAttempt(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateChallengeOrder(): ChallengeType[] {
    const challenges: ChallengeType[] = [
      'image-select',
      'math-equation',
      'text-input',
      'puzzle',
    ];
    
    return challenges;
  }
}
