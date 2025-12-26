import { Component, OnInit } from '@angular/core';
import { MainNavComponent } from './main-nav/main-nav.component';

@Component({
    selector: 'bc-main',
    templateUrl: './main.component.html',
    standalone: true,
    imports: [MainNavComponent]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
