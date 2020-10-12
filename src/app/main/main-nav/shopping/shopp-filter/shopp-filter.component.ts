import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Gender } from 'src/app/models/gender.model';

import { Bike } from 'src/app/models/shopping/bike.model';
import { environment } from 'src/environments/environment';

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
              private http: HttpClient) { }

  ngOnInit() {
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.genders = this.activatedRoute.snapshot.data.genders;
    this.configureForm();
  }

  onSearch(event: any) {
    console.log('Submitted!!!');
    console.log(this.shopForm);
    console.log(event);

    const bikesUrl = `${environment.baseApiUrl}/bikes`;

    this.http.get<Bike[]>(bikesUrl).subscribe(bikes => console.log(bikes));
  }

  //#region Reactive Forms
  private configureForm(): void {
    this.shopForm = new FormGroup({
      category: new FormControl(null),
      gender: new FormControl(null),
      price: new FormControl(null, Validators.pattern(/^\$?\d+((,\d{3})+)?(\.\d+)?$/)),
      gears: new FormControl(0, [Validators.min(0), Validators.max(36)]),
      frameSize: new FormControl(19, [Validators.min(13), Validators.max(24)]),
      rimSize: new FormControl(27.5, [Validators.min(12), Validators.max(29)])
    });
  }
  //#endregion Reactive Forms
}
