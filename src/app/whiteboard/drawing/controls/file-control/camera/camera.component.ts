import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Event } from 'src/app/whiteboard/global-whiteboard/essentials/event';

const user = 'user';
const environment = 'environment';

@Component({
  selector: 'whiteboard-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements AfterViewInit, OnDestroy {

  stillActiveStreams: MediaStream[] = [];

  @ViewChild('video')
  video!: ElementRef;
  videoEl: HTMLVideoElement | undefined;

  @Input() imageCaptured: (photo: string) => void = () => {};
  @Input() reload?: Event;

  private _userMode: boolean = true;
  public set userMode(value: boolean) {
    this._userMode = value;
    this.setStream();
  }
  public get userMode(): boolean {
    return this._userMode;
  }

  public hasEnvironmentCamera: boolean = true;
  public hasUserCamera: boolean = true;

  constructor() { }

  ngAfterViewInit(): void {
    this.videoEl = this.video.nativeElement;
    if (this.reload) {
      this.reload.addListener(() => {
        this.setStream();
      })
    }

    this.setStream();
  }

  ngOnDestroy(): void {
    this.stopStreams();
  }

  stopStreams(): void {
    for (let stream of this.stillActiveStreams) {
      stream.getTracks().forEach(t => {
        t.stop();
      })
    }
    this.stillActiveStreams = [];
  }

  setStream() {
    const facingMode = this.userMode && this.hasUserCamera ? user : environment;
    const constraints = {
      audio: false,
      video: {
        facingMode
      }
    };
  
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.stopStreams();
      this.stillActiveStreams.push(stream);
      try {
        (this.videoEl as HTMLVideoElement).srcObject = stream;
      }
      catch (e) {
        console.log(e)
      }
    });
  }

  capturePicture() {
    if (this.videoEl) {
      let width = this.videoEl.videoWidth;
      let height = this.videoEl.videoHeight;

      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
      
      let image = canvas.toDataURL('image/jpeg');

      this.imageCaptured(image);
    }
  }

}
