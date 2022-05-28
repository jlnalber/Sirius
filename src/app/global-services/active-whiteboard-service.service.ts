import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {

  public isWhiteboardActive = false;
  public isSearchActive = false;

  constructor() { }
}
