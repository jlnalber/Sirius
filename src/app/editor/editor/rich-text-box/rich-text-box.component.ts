import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { Editor } from '../../global/classes/editor';

@Component({
  selector: 'editor-rich-text-box',
  templateUrl: './rich-text-box.component.html',
  styleUrls: ['./rich-text-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RichTextBoxComponent implements OnInit, AfterViewInit {

  @Input() editor!: Editor;

  @ViewChild('wrapper') wrapper!: ElementRef;
  wrapperEl?: HTMLDivElement;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.editor.richTextBoxComponent = this;
    this.wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    
    this.wrapperEl.addEventListener('keydown', e => {
      this.editor.input(e);
    });
  }

}
