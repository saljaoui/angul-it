import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ChallengeAnswer } from '../../../../core/models/attempt.model';
import { StateService } from '../../../../core/services/state.service';
import { FormsModule } from '@angular/forms';

interface Cell {
  id: string;
  isTarget: boolean;
  selected: boolean;
  image: string;
}

@Component({
  selector: 'app-image-select',
  imports: [FormsModule],
  templateUrl: './image-select.html',
  styleUrl: './image-select.scss',
})
export class ImageSelect implements OnInit {
  @Output() completed = new EventEmitter<ChallengeAnswer>();

  private state = inject(StateService);

  prompt = 'traffic light';

  cells: Cell[] = [
    { id: 'c1', isTarget: true, selected: false, image: '/images/traffic-light-1.jpg' },
    { id: 'c2', isTarget: false, selected: false, image: '/images/car-1.jpg' },
    { id: 'c3', isTarget: false, selected: false, image: '/images/road-1.jpg' },
    { id: 'c4', isTarget: false, selected: false, image: '/images/car-2.jpg' },
    { id: 'c5', isTarget: true, selected: false, image: '/images/traffic-light-2.jpg' },
    { id: 'c6', isTarget: false, selected: false, image: '/images/road-2.jpg' },
    { id: 'c7', isTarget: false, selected: false, image: '/images/car-3.jpg' },
    { id: 'c8', isTarget: false, selected: false, image: '/images/road-3.jpg' },
    { id: 'c9', isTarget: true, selected: false, image: '/images/traffic-light-3.jpg' },
  ];

  // ✅ correct indexes are just cells where isTarget is true
  private get correctIndexes(): number[] {
    return this.cells
      .map((cell, i) => (cell.isTarget ? i : -1))
      .filter(i => i !== -1);
  }

  get isValid(): boolean {
    return this.cells.some(cell => cell.selected);
  }

  ngOnInit(): void {
    const attempt = this.state.getAttempt();
    const previous = attempt?.answers.find(a => a.stage === attempt.currentStage);

    if (previous?.data.type === 'image-select') {
      previous.data.selectedIndexes.forEach(i => {
        this.cells[i].selected = true;
      });
    }
  }

  toggle(cell: Cell): void {
    cell.selected = !cell.selected;
  }

  submit(): void {
    const selectedIndexes = this.cells
      .map((cell, i) => (cell.selected ? i : -1))
      .filter(i => i !== -1);

    const correct =
      selectedIndexes.length === this.correctIndexes.length &&
      selectedIndexes.every(i => this.correctIndexes.includes(i));

    this.completed.emit({
      challengeId: crypto.randomUUID(),
      type: 'image-select',
      status: correct ? 'passed' : 'failed',
      correct,
      stage: this.state.getAttempt()!.currentStage, // ✅ needed for Option A pre-fill
      attempts: 1,
      answeredAt: new Date().toISOString(),
      data: { type: 'image-select', selectedIndexes, correctIndexes: this.correctIndexes },
    });
  }
}
