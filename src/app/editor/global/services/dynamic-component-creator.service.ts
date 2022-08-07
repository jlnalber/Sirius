import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, ViewContainerRef } from '@angular/core';
import { WhiteboardWrapperComponent } from '../../editor/rich-text-box/whiteboard-wrapper/whiteboard-wrapper.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentCreatorService {

  constructor(@Inject(ComponentFactoryResolver) private readonly factoryResolver: ComponentFactoryResolver) { }

  public addDynamicComponent(rootViewContainer: ViewContainerRef) {
    const component = rootViewContainer.createComponent(WhiteboardWrapperComponent)
  }
}
