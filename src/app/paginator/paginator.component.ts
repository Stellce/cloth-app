import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy{
  page: number = 0;
  pageSub: Subscription;
  isLastPage: boolean;
  isLastPageSub: Subscription;
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.pageSub = this.appService.pageUpdated.subscribe(page => this.page = page);
    this.isLastPageSub = this.appService.isLastPageUpdate.subscribe(isLast => this.isLastPage = isLast);
  }

  onPrevious() {
    if(this.page === 0) return;
    this.appService.updatePage(-1);
  }
  onNext() {
    if(this.isLastPage) return;
    this.appService.updatePage(1);
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    this.isLastPageSub.unsubscribe();
  }
}
