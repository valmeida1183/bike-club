import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bc-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    standalone: false
})
export class PanelComponent implements OnInit {
  @Input() expanded?: boolean;
  @Input() submitDisabled?: boolean;
  @Input() title: string;
  @Input() description: string;
  @Input() submitText?: string;
  @Input() showSubmit?: boolean;
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
    this.submitText = this.submitText === null || this.submitText === undefined || this.submitText === '' ? null : this.submitText;
    this.showSubmit = this.showSubmit === null || this.showSubmit === undefined ? false : this.showSubmit;
  }
}
