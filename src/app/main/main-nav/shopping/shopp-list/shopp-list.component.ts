import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Bike } from 'src/app/models/bike.model';

@Component({
  selector: 'bc-shopp-list',
  templateUrl: './shopp-list.component.html',
  styleUrls: ['./shopp-list.component.scss']
})
export class ShoppListComponent implements OnInit, OnDestroy {
  bikes$: Observable<any>;
  bikes: Bike[];
  bikesSubscription: Subscription;

  constructor(private store: Store<{shoppingList: any}>) { }

  ngOnInit() {
    this.bikes$ = this.store.select('shoppingList');
    this.bikesSubscription = this.bikes$.subscribe(storeState => {
      console.log(storeState);
      this.bikes = storeState.bikes;
    });
  }

  ngOnDestroy() {
    this.bikesSubscription.unsubscribe();
  }
}
