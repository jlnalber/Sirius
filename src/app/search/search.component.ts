import { ActiveService } from './../global-services/active-whiteboard-service.service';
import { SearchService } from './../global-services/search.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(public readonly searchService: SearchService, private readonly activeService: ActiveService) { 
    this.activeService.isSearchActive = true;
  }

  ngOnDestroy(): void {
    this.activeService.isSearchActive = false;
  }

  ngOnInit(): void {
  }

}
