import { Editor } from '../classes/editor';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorsService {

  public editors: Editor[] = [];

  public addEditor() {
    let editor = new Editor();
    this.editors.push(editor);
    return editor;
  }

  constructor() { }
}
