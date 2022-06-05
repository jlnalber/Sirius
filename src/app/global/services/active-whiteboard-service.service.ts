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
  
  public isSearchActive = false;

  constructor(private readonly router: Router) { }
}
