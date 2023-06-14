import {Security} from "./Security";

export interface Holding {
  units: number;
  holdingValue: number;
  security: Security
}
