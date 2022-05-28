import { ActiveService } from './../../global-services/active-whiteboard-service.service';
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

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: FaecherManagerService, private readonly activeWhiteboardService: ActiveService) { 
    this.activeWhiteboardService.isWhiteboardActive = true;
    
    // get the whiteboard
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.path = this.faecherManager.getPathForWhiteboard(params.fachid, params.einheitid, params.whiteboardid);
        this.electron.ipcRenderer.invoke('request-whiteboard', this.path).then((value: any) => {
          this.whiteboard = value;
        });
      })
    }
    else {
      this.whiteboard = '{"backgroundImage":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHJJREFUeJzt3LENgDAMRFHMjp4yQ4YVfAVCEe/VLqJfpbrq7n0NrLVqcneiaYP54c91976/fsRJxAqIFRArIFZArIBYAbEAAAAAAAAAAAAAAAAAAAAAXmI/a8Z+VkisgFgBsQJiBcQKiBUQK1AWcOcf8wflGhQXhrk3/wAAAABJRU5ErkJggg==","backgroundColor":{"r":255,"g":79,"b":79},"pageIndex":0,"pages":[{"translateX":0,"translateY":0,"zoom":1,"content":""}]}'
    }

    this.faecherManager.whiteboardSavers.addListener(this.saveListener)
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.save();
    this.active = false;
    this.faecherManager.whiteboardSavers.removeListener(this.saveListener);
    this.activeWhiteboardService.isWhiteboardActive = false;
  }

  save() {
    if (this.electron.isElectronApp && this.path != undefined && this.export.handler) {
      let whiteboard = this.export.handler();
      console.log('still here')
      this.electron.ipcRenderer.invoke('write-whiteboard', this.path, JSON.stringify(whiteboard));
    }
  }

}
