import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() hasPrev: boolean = false;
  @Input() hasNext: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  protected readonly constants = APP_CONSTANTS;

  // Emit previous page event
  onPrev() {
    if (this.hasPrev) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  // Emit next page event
  onNext() {
    if (this.hasNext) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}