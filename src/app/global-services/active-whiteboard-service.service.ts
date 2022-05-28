import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveWhiteboardService {

  public isWhiteboardActive = false;

  constructor() { }
}
