import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bc-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() submitText: string;
  @Output() actionPanel = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.actionPanel.emit();
  }
}
