import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {

  private _isWhiteboardActive = false;
  public get isWhiteboardActive(): boolean {
    return this._isWhiteboardActive || this.router.url == '/whiteboard';
  }
  public set isWhiteboardActive(value: boolean) {
    this._isWhiteboardActive = value;
  }

  private _isEditorActive = false;
  public get isEditorActive(): boolean {
    return this._isEditorActive;
  }
  public set isEditorActive(value: boolean) {
    this._isEditorActive = value;
  }
  
  public isSearchActive = false;

  constructor(private readonly router: Router) { }
}
