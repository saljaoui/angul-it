import { Component } from '@angular/core';
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
}
