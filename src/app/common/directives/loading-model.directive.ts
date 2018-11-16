import { ComponentFactoryResolver, Directive, Input, ViewContainerRef } from '@angular/core';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Directive({
  selector: '[ngIfLoadingModel]',
})
export class LoadingModelDirective {
  @Input()
  public set ngIf(val: any) {
    if (!val) {
      const factory = this._resolver.resolveComponentFactory(SpinnerComponent);
      this._viewContainerRef.createComponent(factory);
    }
  }

  private _viewContainerRef: ViewContainerRef;
  private _resolver: ComponentFactoryResolver;

  constructor(viewContainerRef: ViewContainerRef, resolver: ComponentFactoryResolver) {
    this._viewContainerRef = viewContainerRef;
    this._resolver = resolver;
  }
}
