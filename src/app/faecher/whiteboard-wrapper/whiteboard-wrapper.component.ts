import { ActiveService } from '../../global/services/active-whiteboard-service.service';
import { Handler } from './../../whiteboard/global-whiteboard/essentials/handler';
import { FaecherManagerService, WhiteboardSaveConfig } from 'src/app/faecher/global/services/faecher-manager.service';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { Board } from './../../whiteboard/global-whiteboard/board/board';
import { defaultWhiteboard, Whiteboard } from './../../whiteboard/global-whiteboard/interfaces/whiteboard';
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-whiteboard-wrapper',
  templateUrl: './whiteboard-wrapper.component.html',
  styleUrls: ['./whiteboard-wrapper.component.scss']
})
export class WhiteboardWrapperComponent implements AfterViewInit, OnDestroy {

  @Input()
  whiteboard: Whiteboard | undefined;
  
  afterWhiteboardViewInit = (board: Board) => {
    if (this.whiteboard) {
      board.import(this.whiteboard);
    }
  }

  export: Handler<Whiteboard> = new Handler();

  private fachId: string = "";
  private einheitId?: string;
  private whiteboardId: string = "";

  private whiteboardSaveConfigProvider: () => WhiteboardSaveConfig = () => {
    return this.getWhiteboardSaveConfig();
  }

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: FaecherManagerService, private readonly activeService: ActiveService) { 
    this.activeService.isWhiteboardActive = true;
    
    // get the whiteboard
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe(async (params: any) => {
        this.fachId = params.fachid;
        this.einheitId = params.einheitid;
        this.whiteboardId = params.whiteboardid;

        this.whiteboard = await this.faecherManager.getWhiteboard(this.fachId, this.einheitId, this.whiteboardId);
        /*this.electron.ipcRenderer.invoke('request-whiteboard', this.path).then((value: any) => {
          this.whiteboard = value;
        });*/
      })
    }

    this.faecherManager.whiteboardSavers.addProvider(this.whiteboardSaveConfigProvider)
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // finish everything
    this.faecherManager.writeWhiteboard(this.getWhiteboardSaveConfig())
    this.faecherManager.whiteboardSavers.removeProvider(this.whiteboardSaveConfigProvider);

    // save some data
    this.activeService.isWhiteboardActive = false;
  }

  getWhiteboardSaveConfig(): WhiteboardSaveConfig {
    return {
      fachId: this.fachId,
      einheitId: this.einheitId,
      whiteboardId: this.whiteboardId,
      content: this.export.handler ? this.export.handler() : defaultWhiteboard
    }
  }

}
