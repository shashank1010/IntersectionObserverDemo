import { Component, Input, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1> <span *ngIf="appliedData">Random String = {{ appliedData.random }}</span> <h4 class="loader" *ngIf="loader">Loading...</h4>`,
  styles: [`:host{ padding: 2rem;} h1 { font-family: Lato; } .loader { position: absolute; top: 0rem; left: 2rem; }`]
})
export class HelloComponent  {
  @Input() name = 0;
  _data = null;
  @Input() set data (data) {
    this._data = data;
    
    let shouldTrigger = true;
    if (this.isVisible) {
      shouldTrigger = false;
      this.applyData();
    }
    this.shouldTrigger = shouldTrigger;
  };

  get data () { return this._data };
  shouldTrigger = true;
  isVisible = false;
  appliedData = null;
  loader: number;

  trigger() {
      this.shouldTrigger = false;
      this.isVisible = true;
      this.applyData();
  };

  toggle(hideShow) {
    this.isVisible = hideShow
  }

  applyData() {
    const timeout = Math.max(Math.floor(Math.random() * 1500), 300);
    this.loader = setTimeout(() => {
      this.appliedData = this.data;
      this.loader = null;
    }, timeout);
  }
}
