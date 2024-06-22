import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ItemCard} from "./item-card/item-card.model";
import {ActivatedRoute} from "@angular/router";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import {ItemsParamsRequest} from "./item-card/req/items-params-request.model";
import {Filter} from "./filter/filter.model";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import {ItemsPage} from "./item-card/res/items-page.model";
import {ItemsService} from "../../item/items.service";
import { PaginatorComponent } from './paginator/paginator.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FilterComponent } from './filter/filter.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-list-items',
    templateUrl: './list-items.component.html',
    styleUrls: ['./list-items.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatSidenavModule, FilterComponent, BreadcrumbComponent, MatRippleModule, MatProgressSpinnerModule, MatTabsModule, NgFor, ItemCardComponent, PaginatorComponent]
})
export class ListItemsComponent implements OnInit{
  @ViewChild('drawer') drawer: MatDrawer;
  items: ItemCard[] = [];
  subcategories: {id: string; name: string}[] = [];
  itemsParamsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  isLoading: boolean = false;
  page: {number: number, last: boolean} = {
    number: 0,
    last: false
  };
  constructor(
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemsService.page$.subscribe(page => {
      if(!page) return;
      this.isLoading = false;
      this.items = page.content;
      this.page = {
        number: page.number,
        last: page.last
      }
    });

    let params = this.activatedRoute.snapshot.params;
    this.itemsParamsRequest.gender = params['gender'];
    this.itemsParamsRequest.categoryId = params['categoryId'];

    this.isLoading = true;
    this.itemsService.requestSubcategories(this.itemsParamsRequest.categoryId).subscribe(subcategories => {
      this.subcategories = subcategories;
    });
    this.requestItems();
  }

  loadItemsBySubcategory(event: MatTabChangeEvent) {
    this.isLoading = true;
    this.items = <ItemCard[]>[];
    if(event.tab.textLabel === 'All') return this.requestItems();
    let subcategory = this.subcategories
      .find(subcategory =>
        subcategory.name.toLowerCase() === event.tab.textLabel.toLowerCase()
      );
    if(subcategory) this.itemsParamsRequest.subcategoryId = subcategory.id;
    this.requestItems();
  }

  private requestItems() {
    this.itemsService.requestItems(this.itemsParamsRequest).subscribe(page => {
      this.isLoading = false;
      this.page = {
        number: page.number,
        last: page.last
      }
      this.items = page.content;
    });
  }

  filterItems(filter: Filter) {
    let itemsRequest: ItemsParamsRequest = {
      ...this.itemsParamsRequest,
      ...filter
    };
    this.itemsService.requestItems(itemsRequest).subscribe();
    this.drawer.close();
  }

  changePage(pageNumber: number) {
    this.itemsService.changePage(pageNumber).subscribe(page => {
      this.items = page.content;
      this.page = {
        number: page.number,
        last: page.last
      }
    });
  }

  onFavoritesChanged(isFavorite: boolean, itemId: string) {
    // console.log(isFavorite, itemId);
  }
}
