import { Component } from '@angular/core';
import {ItemModel} from "../item.model";
import {NgForm} from "@angular/forms";
import {FilterModel} from "../filter.model";
import {AppService} from "../app.service";

@Component({
  selector: 'app-men',
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.scss']
})
export class MenComponent {

  constructor(private appService: AppService) {}

  filters = {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

  }

  filtersSelected: {sizes: string[]} = {
    sizes: []
  }

  item: ItemModel =
    {
      id: 450945,
      name: "Adidas Gazelle",
      price: 20,
      wlist: true,
      photos: ["assets/nizza-platform-shoes.avif"],
      brand: "Adidas",
      rating: 4.0,
      all_colors: true,
      discount: 0,
      new: false,
      popular: true
    }
  items: ItemModel[] = Array(6).fill(this.item);

  onSubmitForm(form: NgForm) {
    const filter: FilterModel = {
      priceFrom: form.value.priceFrom,
      priceTo: form.value.priceTo
    }
    console.log(form.value);
  }

  changeFilter(filterType: string, filter: string) {
    const sizeIndex = this.filtersSelected.sizes.indexOf(filter);
    if ( sizeIndex < 0) {
      this.filtersSelected.sizes.push(filter);
    } else {
      this.filtersSelected.sizes.splice(sizeIndex, 1);
    }
    // console.log(this.filtersSelected.sizes);
  }
}
