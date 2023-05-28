import { Handler } from './../../whiteboard/global-whiteboard/essentials/handler';
import { defaultEditor, EditorContent } from 'src/app/editor/global/interfaces/editorContent';
import { ActiveService } from './../../global/services/active-whiteboard-service.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ActivatedRoute } from '@angular/router';
import { EditorSaveConfig, MappenManagerService } from '../global/services/mappen-manager.service';
import { Editor } from 'src/app/editor/global/classes/editor';
import { Editor as EditorSaver } from '../../faecher/global/interfaces/fach';

@Component({
  selector: 'faecher-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss']
})
export class EditorWrapperComponent implements OnInit, OnDestroy {

  private editor?: Editor;
  editorExposer: Handler<Editor> = new Handler<Editor>();

  public editorSaver?: EditorSaver;
  public get name(): string {
    console.log(this.editorSaver);
    return this.editorSaver?.name ?? "";
  }
  public set name(value: string) {
    if (this.editorSaver && value != '') {
      this.editorSaver.name = value;
    }
  }

  public editorContent?: EditorContent;

  afterEditorViewInit = (editor: Editor) => {
    if (this.editorContent) {
      editor.import(this.editorContent);
    }
  }


  private gruppeId: string = "";
  private editorId: string = "";

  private editorSaveConfigProvider: () => EditorSaveConfig = () => {
    return this.getEditorSaveConfig();
  }

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: MappenManagerService, private readonly activeService: ActiveService, public readonly ref: ChangeDetectorRef) {
    this.activeService.isEditorActive = true;

    // get the editor
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe(async (params: any) => {
        this.gruppeId = params.fachid;
        this.editorId = params.editorid;

        try {
          this.editorContent = await this.faecherManager.getEditor(this.gruppeId, this.editorId);
          this.editorSaver = this.faecherManager.getEditorInterface(this.gruppeId, this.editorId);
        }
        catch { }
      })
    }

    this.faecherManager.editorSavers.addProvider(this.editorSaveConfigProvider)

    // get the editor
    this.editorExposer.onHandlerChanged.addListener(() => {
      if (this.editorExposer.handler) {
        this.editor = this.editorExposer.handler();
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // finish everything
    this.faecherManager.writeEditor(this.getEditorSaveConfig())
    this.faecherManager.editorSavers.removeProvider(this.editorSaveConfigProvider);

    // save some data
    this.activeService.isEditorActive = false;
  }

  getEditorSaveConfig(): EditorSaveConfig {
    return {
      gruppeId: this.gruppeId,
      editorId: this.editorId,
      content: this.editor ? this.editor.export() : defaultEditor
    }
  }

  public get fullscreen(): boolean {
    return document.fullscreenElement != null;
  }

  fullscreenButtonClicked() {
    if (this.fullscreen) {
      document.exitFullscreen();
    }
    else {
      document.documentElement.requestFullscreen();
    }
    setTimeout(() => this.ref.detectChanges(), 0);
  }

}
