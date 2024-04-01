import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FilterModel} from "./filter.model";
import {NgForm} from "@angular/forms";
import {AppService} from "../../app.service";
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../categories/categories.service";
import {ItemsService} from "../item/items.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit{
  filters = {
    colors: ['black', 'white', 'red', 'yellow', 'green', 'blue', 'violet', 'grey', 'multi'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    sort: [
      {
        name: 'popularity',
        value: 'popularity'
      },
      {
        name: 'price from lowest',
        value: 'price_asc'
      },
      {
        name: 'price from highest',
        value: 'price_desc'
      },
      {
        name: 'newest',
        value: 'newest'
      }
    ],
    brands: [{id: 0, name: ''}]
  };

  sizesCloth = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  sizesShoes: string[] = [];

  filtersSelected: {colors: string[], sizes: string[], brands: string[]} = {
    colors: [],
    sizes: [],
    brands: []
  }

  @Output() closeDrawer = new EventEmitter<void>();
    constructor(
      private itemsService: ItemsService,
      private activatedRoute: ActivatedRoute,
      private categoriesService: CategoriesService
    ) {}
  private setShoeSizes() {
      for (let i=30;i<=46;i++) {
        this.sizesShoes.push(String(i));
      }
  }

  ngOnInit() {
    let categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.categoriesService.requestCategories().subscribe(categories => {
      let categoryName = categories
        .find(c => c.id === categoryId)?.name.toUpperCase();
      if(categoryName === 'SHOES' || categoryName === 'SOCKS') {
        this.setShoeSizes();
        this.filters.sizes = this.sizesShoes;
      } else {
        this.filters.sizes = this.sizesCloth;
      }
    })
    this.itemsService.requestBrands().subscribe(brands => {
      this.filters.brands = brands
    });
  }

  onSubmitFilter(form: NgForm) {
    let filter: FilterModel = {
      priceFrom: form.value.priceFrom,
      priceTo: form.value.priceTo,
      sortBy: form.value.sortBy,
      ...this.filtersSelected
    }
    this.itemsService.requestItemsByFilter(filter);
    console.log(filter);
  }

  changeFilter(filterType: 'colors' | 'brands' | 'sizes', filter: string) {
    // console.log(filter)
    const filterIndex = this.filtersSelected[filterType].indexOf(filter);
    const NOT_FOUND = -1;
    filterIndex === NOT_FOUND ?
      this.filtersSelected[filterType].push(filter) :
      this.filtersSelected[filterType].splice(filterIndex, 1);
    console.log(this.filtersSelected);
    // if (filterType === 'size') {
    //   const sizeIndex = this.filtersSelected.sizes.indexOf(filter);
    //   if ( sizeIndex < 0) {
    //     this.filtersSelected.sizes.push(filter);
    //   } else {
    //     this.filtersSelected.sizes.splice(sizeIndex, 1);
    //   }
    // } else if (filterType === 'brand') {
    //   const brandIndex = this.filtersSelected.brands.indexOf(filter);
    //   if (brandIndex < 0) {
    //     this.filtersSelected.brands.push(filter);
    //   } else {
    //     this.filtersSelected.brands.splice(brandIndex, 1);
    //   }
    // } else if (filterType === 'colors') {
    //   const colorIndex = this.filtersSelected.colors.indexOf(filter);
    //   if(colorIndex < 0) {
    //     console.log('not found');
    //     this.filtersSelected.colors.push(filter);
    //   } else {
    //     console.log('found');
    //     this.filtersSelected.colors.splice(colorIndex, 1);
    //   }
    // }
    // console.log(this.filtersSelected);
  }

  onCloseDrawer() {
    this.closeDrawer.emit();
  }
}
