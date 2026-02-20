import { Component, EventEmitter, Output } from '@angular/core';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { FormsModule } from '@angular/forms';

type CellType = 'traffic-light' | 'other';

interface Cell {
  id: string;
  type: CellType;
  selected: boolean;
}

@Component({
  selector: 'app-image-select',
  imports: [FormsModule],
  templateUrl: './image-select.html',
  styleUrl: './image-select.scss',
})
export class ImageSelect {
  @Output() completed = new EventEmitter<ChallengeAnswer>();

  prompt = 'traffic light';

  cellsTrue: Cell[] = [
    { id: 'c1', type: 'traffic-light', selected: true },
    { id: 'c2', type: 'other', selected: false },
    { id: 'c3', type: 'other', selected: false },
    { id: 'c4', type: 'other', selected: false },
    { id: 'c5', type: 'traffic-light', selected: true },
    { id: 'c6', type: 'other', selected: false },
    { id: 'c7', type: 'other', selected: false },
    { id: 'c8', type: 'other', selected: false },
    { id: 'c9', type: 'traffic-light', selected: true },
  ];

  cells: Cell[] = [
    { id: 'c1', type: 'traffic-light', selected: false },
    { id: 'c2', type: 'other', selected: false },
    { id: 'c3', type: 'other', selected: false },
    { id: 'c4', type: 'other', selected: false },
    { id: 'c5', type: 'traffic-light', selected: false },
    { id: 'c6', type: 'other', selected: false },
    { id: 'c7', type: 'other', selected: false },
    { id: 'c8', type: 'other', selected: false },
    { id: 'c9', type: 'traffic-light', selected: false },
  ];

  toggle(cell: Cell) {
    cell.selected = !cell.selected;
  }

  get isValid(): boolean {
    return this.cells.some((cell) => cell.selected);
  }

  submit(): void {
    const selectedIndexes = this.cells
      .map((cell, index) => (cell.selected ? index : -1))
      .filter((index) => index !== -1);
    const correctIndexes = this.cellsTrue
      .map((cell, index) => (cell.selected ? index : -1))
      .filter((index) => index !== -1);
    const correct =
      selectedIndexes.length === correctIndexes.length &&
      selectedIndexes.every((index) => correctIndexes.includes(index));

    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'image-select',
      status: correct ? 'passed' : 'failed',
      correct,
      attempts: 1,
      answeredAt: new Date().toISOString(),
      data: {
        type: 'image-select',
        selectedIndexes,
        correctIndexes,
      },
    });
  }
}
