import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bc-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }
}
