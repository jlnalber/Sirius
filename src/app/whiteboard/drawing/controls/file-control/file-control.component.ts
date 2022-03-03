import { jsPDF } from 'jspdf';
import { Component, Input, AfterViewInit } from '@angular/core';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-file-control',
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
        if (file.type == 'application/pdf') {
          let pages = new Map<number, [HTMLCanvasElement, string]>();

          

          let render = () => {
            for (let i = 1; i < pages.size + 1; i++) {
              let p = pages.get(i);
              if (p) {
                this.board.addPage();
                let img = this.board.createElement('image');
                img.setAttributeNS(null, 'href', p[1]);
                img.setAttributeNS(null, 'transform', `translate(0 ${p[0].height}) rotate(180) scale(-1 1)`)
              }
            }
          }

          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
          //fileReader.readAsDataURL(file);
          fileReader.onload = (ev) => {
            
            
            if (fileReader.result) {

              //var typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

              GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

              getDocument(fileReader.result as string).promise.then((pdf: any) => {
                //
                // Fetch the first page
                //
                let size: number = pdf.numPages;

                for (let i = 1; i < size + 1; i++) {
                  pdf.getPage(i).then((page: any) => {

                    var scale = 1;
                    var viewport = page.getViewport(scale);

                    let pageNumber: number = page.pageNumber;
                    
                    //
                    // Prepare canvas using PDF page dimensions
                    //
                    let canvas = document.createElement('canvas');
                    //document.body.appendChild(canvas);
                    var context = canvas.getContext('2d');
                    canvas.width = page.view[2];
                    canvas.height = page.view[3];

                    //
                    // Render PDF page into canvas context
                    //
                    var renderContext = {
                      canvasContext: context,
                      viewport: viewport};
 
                    page.render(renderContext).promise.then(() => {
                      let res = canvas.toDataURL('image/png');
                      pages.set(pageNumber, [canvas, res])
                      if (size == pages.size) render();
                      
                    })});
                }
                //console.log(pdf.numPages);
                //console.log(pdf)

            }, (error: any) => {
              console.log(error);
            });
              }
          };

        }
        else {
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
