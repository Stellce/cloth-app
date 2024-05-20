import {Component, OnInit} from '@angular/core';
import {ItemCard} from "../../../../categories/list-items/item-card/item-card.model";
import {ItemsPage} from "../../../../categories/list-items/item-card/res/items-page.model";
import {ItemsService} from "../../../../item/items.service";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit{
  items: ItemCard[];
  isLoading: boolean = true;

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.itemsService.requestLandingPageItems().subscribe({
      next: (page: ItemsPage) => {
        this.isLoading = false;
        this.items = page.content;
      },
      error: (err: any) => console.log(err)
    });
  }

}