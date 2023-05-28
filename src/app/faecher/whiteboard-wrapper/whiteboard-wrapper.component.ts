import { ActiveService } from '../../global/services/active-whiteboard-service.service';
import { Handler } from './../../whiteboard/global-whiteboard/essentials/handler';
import { MappenManagerService, WhiteboardSaveConfig } from '../global/services/mappen-manager.service';
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

  board?: Board;

  afterWhiteboardViewInit = (board: Board) => {
    if (this.whiteboard) {
      board.import(this.whiteboard);
    }
  }

  boardExposer: Handler<Board> = new Handler<Board>();

  private gruppeId: string = "";
  private whiteboardId: string = "";

  private whiteboardSaveConfigProvider: () => WhiteboardSaveConfig = () => {
    return this.getWhiteboardSaveConfig();
  }

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: MappenManagerService, private readonly activeService: ActiveService) {
    this.activeService.isWhiteboardActive = true;

    // get the whiteboard
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe(async (params: any) => {
        this.gruppeId = params.fachid;
        this.whiteboardId = params.whiteboardid;

        this.whiteboard = await this.faecherManager.getWhiteboard(this.gruppeId, this.whiteboardId);
        /*this.electron.ipcRenderer.invoke('request-whiteboard', this.path).then((value: any) => {
          this.whiteboard = value;
        });*/
      })
    }

    this.faecherManager.whiteboardSavers.addProvider(this.whiteboardSaveConfigProvider)

    // listen for getting the board
    this.boardExposer.onHandlerChanged.addListener(() => {
      if (this.boardExposer.handler) {
        this.board = this.boardExposer.handler();
      }
    })
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
      gruppeId: this.gruppeId,
      whiteboardId: this.whiteboardId,
      content: this.board ? this.board.export() : defaultWhiteboard
    }
  }

}
