import { Component } from '@angular/core';
import * as spinnerSrc from './spinner-default.svg';

@Component({
  selector: 'spinner',
  template: `
    <img
      [src]="src"
    />
  `,
})
export class SpinnerComponent {
  src = spinnerSrc;
}
