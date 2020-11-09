import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Bike } from 'src/app/models/bike.model';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';
import { Gender } from 'src/app/models/gender.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'bc-shopp-filter',
  templateUrl: './shopp-filter.component.html',
  styleUrls: ['./shopp-filter.component.scss']
})
export class ShoppFilterComponent implements OnInit {
  shopForm: FormGroup;
  categories: Category[];
  genders: Gender[];
  bikes: Observable<Bike[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<{ shoppingList: Bike[] }>,
              private http: HttpClient) { }

  ngOnInit() {
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.genders = this.activatedRoute.snapshot.data.genders;
    this.configureForm();
    this.bikes = this.store.select('shoppingList');
    console.log(this.bikes.subscribe(bikes => console.log(bikes)));
  }

  onSearch(event: any) {
    console.log('Submitted!!!');
    console.log(this.shopForm);
    console.log(event);

    const bikesUrl = `${environment.baseApiUrl}/bikes`;
    const query = this.shopForm.value;

    this.http.get<Bike[]>(bikesUrl, {params: query}).subscribe(bikes => console.log(bikes));
  }

  //#region Reactive Forms
  private configureForm(): void {
    this.shopForm = new FormGroup({
      categoryId: new FormControl(null),
      genderCode: new FormControl(null),
      price: new FormControl(null, Validators.pattern(/^\$?\d+((,\d{3})+)?(\.\d+)?$/)),
      gears: new FormControl(0, [Validators.min(0), Validators.max(36)]),
      frameSize: new FormControl(19, [Validators.min(13), Validators.max(24)]),
      rimSize: new FormControl(27.5, [Validators.min(12), Validators.max(29)])
    });
  }
  //#endregion Reactive Forms
}
