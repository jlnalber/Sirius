import { Page } from './../../../../global-whiteboard/board/page';
import { Component, Input, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagePreviewComponent implements AfterViewInit, OnDestroy {

  @ViewChild('svgWrapper') svgWrapper!: ElementRef;

  @Input() page!: Page;
  @Input() board!: Board;

  // for listeners
  private alive: boolean = true;
  private changePageListener = () => {
    this.reload(true);
  }
  private changeListener = () => {
    this.reload(false);
  }

  private reload(checkForThisPage: boolean) {
    // method that reloads the preview
    if (this.alive && (!checkForThisPage || this.board.currentPage == this.page)) {
      this.svgWrapper.nativeElement.innerHTML = '';
      let svg = this.page.getSVGPreview();
      svg.classList.add('svgPreview')
      this.svgWrapper.nativeElement.appendChild(svg);
    }
  }

  constructor() { }

  ngOnDestroy(): void {
    // remove event listeners onDestroy
    this.alive = false;
    this.board.onInput.removeListener(this.changePageListener);
    this.board.onBackgroundChange.removeListener(this.changeListener);
  }

  ngAfterViewInit(): void {
    // add event listener on Init
    this.board.onInput.addListener(this.changePageListener);
    this.board.onBackgroundChange.addListener(this.changeListener);
    this.reload(false);
  }

  onClick(): void {
    // set to this page when clicked
    const index = this.board.pages.indexOf(this.page);
    if (index >= 0 && index != this.board.currentPageIndex) {
      this.board.currentPageIndex = index;
    }
  }

  deleteClick(): void {
    // delete this page
    this.board.removePage(this.page);
  }

}
