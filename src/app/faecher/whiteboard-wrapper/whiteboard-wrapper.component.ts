import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { WhiteboardComponent } from './../../whiteboard/whiteboard.component';
import { Whiteboard } from './../../whiteboard/global-whiteboard/interfaces/whiteboard';
import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-whiteboard-wrapper',
  templateUrl: './whiteboard-wrapper.component.html',
  styleUrls: ['./whiteboard-wrapper.component.scss']
})
export class WhiteboardWrapperComponent implements AfterViewInit {

  @Input()
  whiteboard: string | undefined;
  
  onWhiteboardInit = (board: Board) => {
    board.import(JSON.parse(this.whiteboard as string));
  }

  constructor() { 
    this.whiteboard = `{"backgroundImage":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHJJREFUeJzt3LENgDAMRFHMjp4yQ4YVfAVCEe/VLqJfpbrq7n0NrLVqcneiaYP54c91976/fsRJxAqIFRArIFZArIBYAbEAAAAAAAAAAAAAAAAAAAAAXmI/a8Z+VkisgFgBsQJiBcQKiBUQK1AWcOcf8wflGhQXhrk3/wAAAABJRU5ErkJggg==","backgroundColor":{"r":79,"g":79,"b":255},"pageIndex":0,"pages":[{"translateX":0,"translateY":0,"zoom":1,"content":"<path stroke=\\\"#FFFFFF\\\" stroke-width=\\\"5\\\" stroke-linecap=\\\"round\\\" d=\\\"M741 442 Q 750 442 762 441 Q 779 439 796 436 Q 817 432 881 412 Q 901 404 912 399 Q 919 390 916 376 Q 906 360 882 338 Q 868 333 853 331 Q 830 338 821 347 Q 813 361 799 414 Q 793 448 789 486 Q 783 556 780 580 L 780 580\\\" fill=\\\"transparent\\\"></path><path stroke=\\\"#ffffff\\\" stroke-width=\\\"5\\\" stroke-linecap=\\\"round\\\" d=\\\"M698 711 Q 718 711 729 712 Q 740 712 748 712 Q 762 710 771 709 Q 787 703 793 698 Q 798 691 803 682 Q 804 678 815 682 Q 835 695 845 700 Q 855 704 874 709 Q 881 710 887 710 Q 896 708 901 700 Q 903 687 908 671 Q 911 666 915 662 Q 918 661 936 662 Q 950 664 964 667 Q 984 673 988 674 L 988 674\\\" fill=\\\"transparent\\\"></path><path stroke=\\\"#ffffff\\\" stroke-width=\\\"5\\\" stroke-linecap=\\\"round\\\" d=\\\"M9 866 L 9 866\\\" fill=\\\"transparent\\\"></path><rect stroke=\\\"#ff00ff\\\" stroke-width=\\\"5\\\" fill=\\\"#edbf477f\\\" x=\\\"509\\\" y=\\\"204\\\" width=\\\"589\\\" height=\\\"556\\\"></rect>"},{"translateX":0,"translateY":0,"zoom":1,"content":"<path stroke=\\\"#ffffff\\\" stroke-width=\\\"5\\\" stroke-linecap=\\\"round\\\" d=\\\"M1079 628 Q 1053 608 1037 592 Q 1020 575 992 542 Q 980 525 970 511 Q 951 489 944 483 Q 938 480 926 478 Q 921 483 916 492 Q 907 518 905 534 Q 901 551 894 590 Q 889 610 884 627 Q 870 653 861 662 Q 852 666 829 662 Q 817 652 805 638 Q 784 598 776 577 Q 771 559 765 528 Q 764 521 763 518 Q 758 523 753 534 Q 741 556 734 569 Q 727 579 718 592 Q 714 595 711 598 Q 710 609 717 632 L 719 633\\\" fill=\\\"transparent\\\"></path>"}]}`;
  }

  ngAfterViewInit(): void {
  }

}
