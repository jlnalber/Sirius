import { Stroke } from './../../../global/stroke';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pen-control',
  templateUrl: './pen-control.component.html',
  styleUrls: ['./pen-control.component.scss']
})
export class PenControlComponent implements OnInit {

  @Input() stroke!: Stroke;
  active: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
