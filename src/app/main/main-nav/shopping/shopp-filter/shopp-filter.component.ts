import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { loadBikes } from 'src/app/store/actions/shopping-list.actions';

@Component({
  selector: 'bc-shopp-filter',
  templateUrl: './shopp-filter.component.html',
  styleUrls: ['./shopp-filter.component.scss']
})
export class ShoppFilterComponent implements OnInit {
  shopForm: FormGroup;
  categories: Category[];
  genders: Gender[];

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<{ shoppingList: any }>) { }

  ngOnInit() {
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.genders = this.activatedRoute.snapshot.data.genders;
    this.configureForm();
  }

  onSearch(event: any) {
    const query = this.shopForm.value;
    this.store.dispatch(loadBikes({query}));
  }

  //#region Reactive Forms
  private configureForm(): void {
    this.shopForm = new FormGroup({
      categoryId: new FormControl(null),
      genderCode: new FormControl(null),
      price: new FormControl(null, Validators.pattern(/^\$?\d+((,\d{3})+)?(\.\d+)?$/)),
      gears: new FormControl(21, [Validators.min(0), Validators.max(36)]),
      frameSize: new FormControl(19, [Validators.min(13), Validators.max(24)]),
      rimSize: new FormControl(27.5, [Validators.min(12), Validators.max(29)])
    });
  }
  //#endregion Reactive Forms
}
