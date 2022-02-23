import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss']
})
export class FileControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
  }

  public openFile() {
    try {
      let inp = document.getElementById('inp') as HTMLInputElement;
      const file = inp.files?.item(0);
      
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        
        // helper to get dimensions of an image
        const imageDimensions = (file: any) => 
            new Promise((resolve, reject) => {
                const img = new Image()
        
                // the following handler will fire after the successful loading of the image
                img.onload = () => {
                    const { naturalWidth: width, naturalHeight: height } = img
                    resolve({ width, height })
                }
            
                img.src = URL.createObjectURL(file)
        })

        reader.onload = async () => {
          let dim: any = await imageDimensions(file);
          let img = this.board.createElement('image');
          if (reader.result) img.setAttributeNS(null, 'href', reader.result.toString());
          img.setAttributeNS(null, 'width', dim.width);
          img.setAttributeNS(null, 'height', dim.height);
        };
      }
    }
    catch { }
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
