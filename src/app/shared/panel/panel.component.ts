import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bc-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() expanded?: boolean;
  @Input() submitDisabled?: boolean;
  @Input() title: string;
  @Input() description: string;
  @Input() submitText: string;
  @Output() actionPanel = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    this.setDefaultValues();
  }

  onSubmit() {
    this.actionPanel.emit();
  }

  private setDefaultValues() {
    this.expanded = this.expanded === null || this.expanded === undefined ? true : this.expanded;
    this.submitDisabled = this.submitDisabled === null || this.submitDisabled === undefined ? true : this.submitDisabled;
  }
}
