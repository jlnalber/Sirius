import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { ControlsComponent } from './editor/controls/controls.component';
import { RichTextBoxComponent } from './editor/rich-text-box/rich-text-box.component';

import { MatIconModule } from '@angular/material/icon';
import { WhiteboardWrapperComponent } from './editor/rich-text-box/whiteboard-wrapper/whiteboard-wrapper.component';



@NgModule({
  declarations: [
    EditorComponent,
    ControlsComponent,
    RichTextBoxComponent,
    WhiteboardWrapperComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
