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
      totalStages: 3,
      score: 0,
      startedAt: new Date().toISOString(),
      finishedAt: null,
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

  goToPreviousStage(): Attempt | null {
    const attempt = this.getAttempt();
    if (!attempt || attempt.currentStage === 0) return null;

    attempt.currentStage -= 1;

    // ✅ don't delete the answer — keep it for pre-filling
    const correctCount = attempt.answers.filter(a => a.correct).length;
    attempt.score = Math.round((correctCount / attempt.totalStages) * 100);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempt));
    return attempt;
  }

  advanceStage(answer: ChallengeAnswer): Attempt | null {
    const attempt = this.getAttempt();
    if (!attempt) return null;

    // ✅ replace existing answer for this stage instead of pushing a duplicate
    const existingIndex = attempt.answers.findIndex(a => a.stage === attempt.currentStage);
    if (existingIndex !== -1) {
      attempt.answers[existingIndex] = answer; // replace
    } else {
      attempt.answers = [...attempt.answers, answer]; // add new
    }

    const correctCount = attempt.answers.filter(a => a.correct).length;
    attempt.score = Math.round((correctCount / attempt.totalStages) * 100);

    if (attempt.currentStage < attempt.totalStages - 1) {
      attempt.currentStage += 1;
    } else {
      attempt.status = 'finished';
      attempt.finishedAt = new Date().toISOString();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempt));
    return attempt;
  }

  private generateChallengeOrder(): ChallengeType[] {
    const challenges: ChallengeType[] = [
      'image-select',
      'math-equation',
      'text-input',
    ];

    return challenges;
  }
}
