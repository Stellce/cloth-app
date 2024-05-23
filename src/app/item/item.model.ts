import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemParams} from "./item.params.model";

export interface Item extends ItemCard, ItemParams {
  params?: ItemParams;
  reviews: string[];
}
