import { Editor } from '../../global/classes/editor';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'editor-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, AfterViewInit {

  @Input() editor!: Editor;

  constructor() {
    //document.execCommand('insertBrOnReturn', false, false.toString());
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  redo() {
    this.editor.redo();
  }

  undo() {
    this.editor.undo();
  }

  bold() {
    this.editor.bold();
  }

  italic() {
    this.editor.italic();
  }

  underline() {
    this.editor.underline();
  }

  strikethrough() {
    this.editor.strikethrough();
  }

  sup() {
    this.editor.sup();
  }

  sub() {
    this.editor.sub();
  }

  unformat() {
    this.editor.unformat();
  }

  alignLeft() {
    this.editor.alignLeft
  }

  alignCenter() {
    this.editor.alignCenter();
  }

  alignRight() {
    this.editor.alignRight();
  }

  alignJustify() {
    this.editor.alignJustify();
  }

  indent() {
    this.editor.indent();
  }

  outdent() {
    this.editor.outdent();
  }

  ul() {
    this.editor.ul();
  }

  ol() {
    this.editor.ol();
  }

  addWhiteboard() {
    this.editor.addWhiteboard();
  }

}
