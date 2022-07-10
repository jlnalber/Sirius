import { EditorsService } from './../global/services/editors.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Editor } from '../global/classes/editor';
import { Handler } from 'src/app/whiteboard/global-whiteboard/essentials/handler';

@Component({
  selector: 'editor-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @Input() exposer?: Handler<Editor>;
  @Input() afterViewInit: (editor: Editor) => void = (e: Editor) => { };

  public editor: Editor;

  constructor(private readonly editorService: EditorsService) {
    this.editor = this.editorService.addEditor();
    this.editor.editorComponent = this;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.exposer) {
      this.exposer.handler = () => {
        return this.editor;
      }
    }

    setTimeout(() => {
      this.afterViewInit(this.editor);
    }, 0)
  }

}
