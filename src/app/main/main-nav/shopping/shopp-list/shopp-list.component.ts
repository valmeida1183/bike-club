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
  bikes$: Observable<Bike[]>;
  // private subscription: Subscription;

  constructor(private store: Store<{shoppingList: Bike[]}>) { }

  ngOnInit() {
    this.bikes$ = this.store.select('shoppingList');
    this.bikes$.subscribe(bikes => console.log(bikes));
    // this.subscription = this.bikes$.subscribe(bikes => console.log(bikes));
    // console.log(this.subscription);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
