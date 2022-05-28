import { SearchService } from './../global-services/search.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(public readonly searchService: SearchService) { }

  ngOnInit(): void {
  }

}
