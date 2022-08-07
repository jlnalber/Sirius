import { DynamicComponentCreatorService } from './../services/dynamic-component-creator.service';
import { RichTextBoxComponent } from '../../editor/rich-text-box/rich-text-box.component';
import { Event } from 'src/app/whiteboard/global-whiteboard/essentials/event';
import { EditorComponent } from '../../editor/editor.component';
import { EditorContent } from '../interfaces/editorContent';

export class Editor {

    public editorComponent?: EditorComponent;
    public richTextBoxComponent?: RichTextBoxComponent;
    
    public readonly onInput: Event = new Event();
    public readonly onImport: Event = new Event();

    constructor(private readonly dynamicComponentCreatorService: DynamicComponentCreatorService) { }

    public input(e: KeyboardEvent) {

        if (e.key == 'Enter') {
            let sel = document.getSelection();
            let p = sel?.anchorNode instanceof Text ? sel?.anchorNode.parentNode : sel?.anchorNode;
            console.log(p, typeof p, p instanceof Text);
            let parent = p == this.richTextBoxComponent?.wrapperEl ? p : p?.parentNode;
            
            let newP = document.createElement('p');
            let br = document.createElement('br');
            newP.appendChild(br);
            
            let parentNodes = parent?.childNodes;
            if (parentNodes?.item(parentNodes.length - 1) == p) {
                parent?.appendChild(newP);
            }
            else {
                let index = 0;
                let i = 0;
                parentNodes?.forEach(item => {
                    i++;
                    if (item == p) {
                        index = i;
                    }
                })

                let afterEl = parentNodes?.item(index);
                if (afterEl) parent?.insertBefore(newP, afterEl);
            }
            
            e.preventDefault();
        }

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

    public addWhiteboard() {
        if (this.richTextBoxComponent) {
            //this.dynamicComponentCreatorService.addDynamicComponent(this.richTextBoxComponent.viewContainerRef);
        }
    }
    // #endregion
}