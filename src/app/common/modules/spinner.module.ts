import { NgModule } from '@angular/core';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { LoadingModelDirective } from '../directives/loading-model.directive';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    SpinnerComponent,
    LoadingModelDirective,
  ],
  entryComponents: [
    SpinnerComponent,
  ],
  exports: [
    SpinnerComponent,
    LoadingModelDirective,
  ],
  imports: [
    SharedModule,
  ],
})
export class SpinnerModule { }
