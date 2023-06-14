import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import stocks from '../../assets/stocks';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  myControl = new FormControl('');
  options: string[] = stocks.stocks;
  filteredOptions!: Observable<string[]>;
  selectedSecurities: string[] = [];

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectOption($event: any) {
    this.selectedSecurities.push($event.option.value);
    this.myControl.setValue('');
  }
}
