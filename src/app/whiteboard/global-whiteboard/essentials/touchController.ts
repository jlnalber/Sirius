import { Point } from './../interfaces/point';

interface TouchControllerEvents {
    touchStart: (point: Point) => void,
    touchMove: (from: Point, to: Point) => void,
    touchEnd: (point: Point) => void,
    stylusStart: (point: Point) => void,
    stylusMove: (from: Point, to: Point) => void,
    stylusEnd: (point: Point) => void,
    mouseStart: (point: Point) => void,
    mouseMove: (from: Point, to: Point) => void,
    mouseEnd: (point: Point) => void,
    pinchZoom?: (factor: number, point: Point) => void
}

// this class is able to catch events fired in HTML or SVG elements and can distinguish between touch, mouse and stylus
export class TouchController {
    constructor (public touchControllerEvents: TouchControllerEvents, public readonly element: HTMLElement | SVGElement) {
        this.captureEvents();

        if (this.touchControllerEvents.pinchZoom) {
            this.capturePinchZoomEvents();
        }
    }

    private captureEvents() {
        
        /*let getPosFromMouseEvent = (e: MouseEvent): Point => {
            const rect = this.element.getBoundingClientRect() as DOMRect;
  
            return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
            };
        }*/
        
        let getPosFromPointerEvent = (e: PointerEvent): Point => {
            const rect = this.element.getBoundingClientRect() as DOMRect;

            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
  
      /*let getPosFromTouchEvent = (e: any): Point => {
        let res1: any = e.changedTouches[0];
  
        const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
        
        return {
          x: res1.clientX - rect.left,
          y: res1.clientY - rect.top
        };
      }*/

        let lastPoint: Point = {
            x: 0,
            y: 0
        }

        let ongoingTouch: boolean = false;

        let start = (e: PointerEvent | Event) => {
            if (!ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': this.touchControllerEvents.stylusStart(point); break;
                    case 'mouse': this.touchControllerEvents.mouseStart(point); break;
                    case 'touch': this.touchControllerEvents.touchStart(point); break;
                }

                lastPoint = point;
                ongoingTouch = true;
            }
        }

        let move = (e: PointerEvent | Event) => {
            if (ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': this.touchControllerEvents.stylusMove(lastPoint, point); break;
                    case 'mouse': this.touchControllerEvents.mouseMove(lastPoint, point); break;
                    case 'touch': this.touchControllerEvents.touchMove(lastPoint, point); break;
                }

                lastPoint = point;
            }
        }

        let end = (e: PointerEvent | Event) => {
            if (ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': this.touchControllerEvents.stylusEnd(point); break;
                    case 'mouse': this.touchControllerEvents.mouseEnd(point); break;
                    case 'touch': this.touchControllerEvents.touchEnd(point); break;
                }

                lastPoint = {
                    x: 0,
                    y: 0
                };
                ongoingTouch = false;
            }
        }


        this.element.addEventListener('pointerdown', (ev: PointerEvent | Event) => {
            start(ev);
        })
        this.element.addEventListener('pointermove', (ev: PointerEvent | Event) => {
            move(ev);
        })
        this.element.addEventListener('pointerup', (ev: PointerEvent | Event) => {
            end(ev);
        })
        this.element.addEventListener('pointerleave', (ev: PointerEvent | Event) => {
            end(ev);
        })
        this.element.addEventListener('pointercancel', (ev: PointerEvent | Event) => {
            end(ev);
        })
        this.element.addEventListener('pointerout', (ev: PointerEvent | Event) => {
            return;
        })
        this.element.addEventListener('pointerover', (ev: PointerEvent | Event) => {
            return;
        })
        this.element.addEventListener('pointerenter', (ev: PointerEvent | Event) => {
            return;
        })

        this.element.addEventListener('contextmenu', (ev: Event) => {
            ev.preventDefault();
        })

  
      /*this.svgElement?.addEventListener('mouseup', async (e: MouseEvent) => {
        e.preventDefault();
        await this.board.endMouse(getPosFromMouseEvent(e));
      })
      this.svgElement?.addEventListener('mouseleave', async (e: MouseEvent) => {
        e.preventDefault();
        if (e.buttons != 0) {
          await this.board.endMouse(getPosFromMouseEvent(e));
        }
      })
      this.svgElement?.addEventListener('touchcancel', async (e: any) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
        await this.board.endTouch(getPosFromTouchEvent(e));
      });
      this.svgElement?.addEventListener('touchend', async (e: any) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
        await this.board.endTouch(getPosFromTouchEvent(e));
      });
      this.svgElement?.addEventListener('contextmenu', (e: any) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
      })
  
      // this will capture all mousedown events from the canvas element
      fromEvent(this.svgElement as SVGSVGElement, 'mousedown')
        .pipe(
          switchMap((e: any) => {
            let m = e as MouseEvent;
            m.preventDefault();
            this.board.startMouse(getPosFromMouseEvent(m));
  
            // after a mouse down, we'll record all mouse moves
            return fromEvent(this.svgElement as SVGSVGElement, 'mousemove')
              .pipe(
                // we'll stop (and unsubscribe) once the user releases the mouse
                // this will trigger a 'mouseup' event    
                takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'mouseup')),
                // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'mouseleave')),
                // pairwise lets us get the previous value to draw a line from
                // the previous point to the current point    
                pairwise()
              )
          })
        )
        .subscribe(async (res: any) => {
          res[0].preventDefault();
          res[1].preventDefault();
          
          const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
    
          // previous and current position with the offset
          const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };
    
          const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };
    
          await this.board.moveMouse(prevPos, currentPos);
        });
        
        // this will capture all mousedown events from the canvas element
        fromEvent(this.svgElement as SVGSVGElement, 'touchstart')
          .pipe(
            switchMap((e) => {
              e.preventDefault();
              this.board.startTouch(getPosFromTouchEvent(e));
    
              // after a mouse down, we'll record all mouse moves
              return fromEvent(this.svgElement as SVGSVGElement, 'touchmove')
                .pipe(
                  // we'll stop (and unsubscribe) once the user releases the mouse
                  // this will trigger a 'mouseup' event    
                  takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'touchend')),
                  // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                  takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'touchcancel')),
                  // pairwise lets us get the previous value to draw a line from
                  // the previous point to the current point    
                  pairwise()
                )
            })
          )
          .subscribe(async (res: any) => {
            res[0].preventDefault();
            res[1].preventDefault();
            let res1: any = res[0].changedTouches[0];
            let res2: any = res[1].changedTouches[0];
  
            const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
      
            // previous and current position with the offset
            const prevPos = {
              x: res1.clientX - rect.left,
              y: res1.clientY - rect.top
            };
      
            const currentPos = {
              x: res2.clientX - rect.left,
              y: res2.clientY - rect.top
            };
      
            await this.board.moveTouch(prevPos, currentPos);
          });*/
    }
    
    private capturePinchZoomEvents() {
        // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html 

        // Global vars to cache event state
        let evCache: PointerEvent[] = [];
        let prevDiff = -1;

        let pointerdown_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent) {
                // The pointerdown event signals the start of a touch interaction.
                // This event is cached to support 2-finger gestures
                evCache.push(ev);
            }
        }

        let pointermove_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent) {
                // This function implements a 2-pointer horizontal pinch/zoom gesture. 
                //
                // If the distance between the two pointers has increased (zoom in), 
                // the taget element's background is changed to "pink" and if the 
                // distance is decreasing (zoom out), the color is changed to "lightblue".
                //
                // This function sets the target element's border to "dashed" to visually
                // indicate the pointer's target received a move event.

                // Find this event in the cache and update its record with this event
                for (let i = 0; i < evCache.length; i++) {
                    if (ev.pointerId == evCache[i].pointerId) {
                        evCache[i] = ev;
                    break;
                    }
                }

                // If two pointers are down, check for pinch gestures
                if (evCache.length == 2) {
                    // Calculate the distance between the two pointers
                    let p0 = {
                    x: evCache[0].clientX as number,
                    y: evCache[0].clientY as number
                    }
                    let p1 = {
                    x: evCache[1].clientX as number,
                    y: evCache[1].clientY as number
                    }
                    let curDiff = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));

                    const rect = this.element.getBoundingClientRect() as DOMRect;
                    let averageP = {
                    x: (p0.x + p1.x) / 2 - rect.left,
                    y: (p0.y + p1.y) / 2 - rect.top
                    }

                    if (prevDiff > 0 && curDiff > 0 && this.touchControllerEvents.pinchZoom) {
                    // zoom to the middle by the amount that was scrolled
                    this.touchControllerEvents.pinchZoom(curDiff / prevDiff, averageP);
                    /*if (curDiff > prevDiff) {
                        // The distance between the two pointers has increased
                    }
                    if (curDiff < prevDiff) {
                        // The distance between the two pointers has decreased
                    }*/
                    }

                    // Cache the distance for the next move event 
                    prevDiff = curDiff;
                }
            }
        }

        let pointerup_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent) {
                // Remove this pointer from the cache and reset the target's
                // background and border
                remove_event(ev);
                
                // If the number of pointers down is less than two then reset diff tracker
                if (evCache.length < 2) prevDiff = -1;
            }
        }

        let remove_event = (ev: PointerEvent) => {
        // Remove this event from the target's cache
        for (let i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
            }
        }
        }

        this.element.addEventListener('pointerdown', (ev: Event | PointerEvent) => pointerdown_handler(ev));
        this.element.addEventListener('pointermove', (ev: Event | PointerEvent) => pointermove_handler(ev));

        // Use same handler for pointer{up,cancel,out,leave} events since
        // the semantics for these events - in this app - are the same.
        this.element.addEventListener('pointerup', (ev: Event | PointerEvent) => pointerup_handler(ev));
        this.element.addEventListener('pointercancel', (ev: Event | PointerEvent) => pointerup_handler(ev));
        this.element.addEventListener('pointerout', (ev: Event | PointerEvent) => pointerup_handler(ev));
        this.element.addEventListener('pointerleave', (ev: Event | PointerEvent) => pointerup_handler(ev));
    }

}