import { RichTextBoxComponent } from '../../editor/rich-text-box/rich-text-box.component';
import { Event } from 'src/app/whiteboard/global-whiteboard/essentials/event';
import { EditorComponent } from '../../editor/editor.component';
import { EditorContent } from '../interfaces/editorContent';

export class Editor {

    public editorComponent?: EditorComponent;
    public richTextBoxComponent?: RichTextBoxComponent;
    
    public readonly onInput: Event = new Event();
    public readonly onImport: Event = new Event();

    constructor() { }

    public input(e: KeyboardEvent) {
        if (e.key == 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                document.execCommand('outdent');
            }
            else {
                document.execCommand('indent');
            }
        }

        this.onInput.emit();
    }

    public export(): EditorContent {
        if (this.richTextBoxComponent && this.richTextBoxComponent.wrapperEl) {
            return {
                content: this.richTextBoxComponent.wrapperEl.innerHTML
            }
        }
        throw 'RichTextComponent undefined.';
    }

    public import(editorExport: EditorContent): void {
        if (this.richTextBoxComponent && this.richTextBoxComponent.wrapperEl) {
            this.richTextBoxComponent.wrapperEl.innerHTML = editorExport.content;
            this.onImport.emit();
        }
    }

    // #region actions
    public redo(): void {
        document.execCommand('redo')
    }

    public undo() {
        document.execCommand('undo')
    }
  
    public bold() {
        document.execCommand('bold')
    }
  
    public italic() {
        document.execCommand('italic')
    }
  
    public underline() {
        document.execCommand('underline')
    }
  
    public strikethrough() {
        document.execCommand('strikeThrough')
    }
  
    public sup() {
        document.execCommand('superscript')
    }
  
    public sub() {
        document.execCommand('subscript')
    }
  
    public unformat() {
        document.execCommand('removeFormat')
    }
  
    public alignLeft() {
        document.execCommand('justifyLeft')
    }
  
    public alignCenter() {
        document.execCommand('justifyCenter')
    }
  
    public alignRight() {
        document.execCommand('justifyRight')
    }
  
    public alignJustify() {
        document.execCommand('justifyFull')
    }
  
    public indent() {
        document.execCommand('indent')
    }
  
    public outdent() {
        document.execCommand('outdent')
    }
  
    public ul() {
        document.execCommand('insertUnorderedList');
    }
  
    public ol() {
        document.execCommand('insertOrderedList');
    }
    // #endregion
}