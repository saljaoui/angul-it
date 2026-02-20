export type ChallengeType   = 'image-select' | 'math-equation' | 'text-input' | 'puzzle';
export type AttemptStatus   = 'started' | 'finished';
export type AnswerStatus    = 'passed' | 'failed';   // ✅ only for ChallengeAnswer
export type StageStatus     = 'locked' | 'active' | 'passed' | 'failed'; // ✅ if you need it for UI

export interface ImageSelectAnswer  { type: 'image-select';  selectedIndexes: number[]; correctIndexes: number[]; }
export interface MathEquationAnswer { type: 'math-equation'; selectedOption: number;    correctOption: number;    timeRemainingSeconds: number; }
export interface TextInputAnswer    { type: 'text-input';    typed: string;             expected: string; }
export interface PuzzleAnswer       { type: 'puzzle';        completed: boolean;        timeRemainingSeconds: number; }

export type AnswerData = ImageSelectAnswer | MathEquationAnswer | TextInputAnswer | PuzzleAnswer;

export interface ChallengeAnswer {
  challengeId: string;
  type: ChallengeType;
  status: AnswerStatus;    // ✅ only 'passed' | 'failed'
  correct: boolean;
  attempts: number;
  stage: number;
  answeredAt: string;
  data: AnswerData;
}

export interface Attempt {
  id: string;
  status: AttemptStatus;
  currentStage: number;
  totalStages: number;
  score: number;
  startedAt: string;
  finishedAt: string | null;
  challengeOrder: ChallengeType[];
  answers: ChallengeAnswer[];
}