import { Handler } from './../../whiteboard/global-whiteboard/essentials/handler';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { Board } from './../../whiteboard/global-whiteboard/board/board';
import { WhiteboardComponent } from './../../whiteboard/whiteboard.component';
import { Whiteboard } from './../../whiteboard/global-whiteboard/interfaces/whiteboard';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-whiteboard-wrapper',
  templateUrl: './whiteboard-wrapper.component.html',
  styleUrls: ['./whiteboard-wrapper.component.scss']
})
export class WhiteboardWrapperComponent implements AfterViewInit, OnDestroy {

  @Input()
  whiteboard: string | undefined;
  
  afterWhiteboardViewInit = (board: Board) => {
    board.import(JSON.parse(this.whiteboard as string));
  }

  export: Handler<Whiteboard> = new Handler();

  private path: string = '';

  private active: boolean = true;

  private saveListener = () => {
    if (this.active) {
      this.save();
    }
  }

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: FaecherManagerService) { 
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.path = this.faecherManager.getPathForWhiteboard(params.fachid, params.einheitid, params.whiteboardid);
        this.electron.ipcRenderer.invoke('request-whiteboard', this.path).then((value: any) => {
          this.whiteboard = value;
        });
      })
    }

    this.faecherManager.whiteboardSavers.addListener(this.saveListener)
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.save();
    this.active = false;
    this.faecherManager.whiteboardSavers.removeListener(this.saveListener);
  }

  save() {
    if (this.electron.isElectronApp && this.path != undefined && this.export.handler) {
      let whiteboard = this.export.handler();
      console.log('still here')
      this.electron.ipcRenderer.invoke('write-whiteboard', this.path, JSON.stringify(whiteboard));
    }
  }

}
