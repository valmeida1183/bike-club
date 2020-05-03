import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bc-shopp-filter',
  templateUrl: './shopp-filter.component.html',
  styleUrls: ['./shopp-filter.component.scss']
})
export class ShoppFilterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSearch() {
    console.log('Submitted!!!');
  }
}
