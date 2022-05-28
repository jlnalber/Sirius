import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'faecher-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {

  @Input() categoryId: string | undefined;
  @Output() categoryIdChange: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  constructor(public readonly faecherManager: FaecherManagerService) { }

  ngOnInit(): void {
  }

}
