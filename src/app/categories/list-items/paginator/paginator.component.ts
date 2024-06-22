import {Component, EventEmitter, Input, Output} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class PaginatorComponent {
  @Output() changePage = new EventEmitter<number>();
  @Input() page: {number: number, last: boolean};

  onChangePage(changePage: number) {
    let pageNumber = this.page.number + changePage;
    let lessThan = pageNumber < 0;
    let greaterThan = changePage > 0 && this.page.last;
    if(lessThan || greaterThan) return;
    this.changePage.emit(pageNumber);
  }
}
