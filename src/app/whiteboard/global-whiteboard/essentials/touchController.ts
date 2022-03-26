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

    private mainTouchEventId: number | undefined;
    private evCache: PointerEvent[] = [];

    private captureEvents() {
        
        let getPosFromPointerEvent = (e: PointerEvent): Point => {
            const rect = this.element.getBoundingClientRect() as DOMRect;

            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        let lastPoint: Point | undefined;

        let ongoingTouch: boolean = false;

        let start = (e: PointerEvent | Event) => {
            if (!ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': this.touchControllerEvents.stylusStart(point); break;
                    case 'mouse': this.touchControllerEvents.mouseStart(point); break;
                    case 'touch': if (this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) this.touchControllerEvents.touchStart(point); break;
                }

                if (e.pointerType != 'touch' || this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) {
                  lastPoint = point;
                }
                ongoingTouch = true;
            }
        }

        let move = (e: PointerEvent | Event) => {
            if (ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                if (lastPoint != undefined) {
                    switch (e.pointerType) {
                        case 'pen': this.touchControllerEvents.stylusMove(lastPoint, point); break;
                        case 'mouse': this.touchControllerEvents.mouseMove(lastPoint, point); break;
                        case 'touch': if (this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) this.touchControllerEvents.touchMove(lastPoint, point); break;
                    }
                }

                if (e.pointerType != 'touch' || this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) {
                    lastPoint = point;
                }

                if (e.pointerType == 'touch' && this.mainTouchEventId == undefined) {
                    this.mainTouchEventId = e.pointerId;
                }
            }
        }

        let end = (e: PointerEvent | Event) => {
            if (ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': this.touchControllerEvents.stylusEnd(point); break;
                    case 'mouse': this.touchControllerEvents.mouseEnd(point); break;
                    case 'touch': if (this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) this.touchControllerEvents.touchEnd(point); break;
                }

                if (e.pointerType != 'touch' || this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) {
                  lastPoint = undefined;
                  if (this.evCache.length < 1) {
                      ongoingTouch = false;
                  }
                }
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
    }
    
    private capturePinchZoomEvents() {
        // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html 

        // Global vars to cache event state
        let prevDiff = -1;

        let pointerdown_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
                // The pointerdown event signals the start of a touch interaction.
                // This event is cached to support 2-finger gestures
                this.evCache.push(ev);

                if (this.mainTouchEventId == undefined) {
                  this.mainTouchEventId = ev.pointerId;
                }
            }
        }

        let pointermove_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
                // This function implements a 2-pointer horizontal pinch/zoom gesture. 
                //
                // If the distance between the two pointers has increased (zoom in), 
                // the taget element's background is changed to "pink" and if the 
                // distance is decreasing (zoom out), the color is changed to "lightblue".
                //
                // This function sets the target element's border to "dashed" to visually
                // indicate the pointer's target received a move event.

                // Find this event in the cache and update its record with this event
                for (let i = 0; i < this.evCache.length; i++) {
                    if (ev.pointerId == this.evCache[i].pointerId) {
                        this.evCache[i] = ev;
                        break;
                    }
                }

                // If two pointers are down, check for pinch gestures
                if (this.evCache.length == 2) {
                    // Calculate the distance between the two pointers
                    let p0 = {
                        x: this.evCache[0].clientX as number,
                        y: this.evCache[0].clientY as number
                    }
                    let p1 = {
                        x: this.evCache[1].clientX as number,
                        y: this.evCache[1].clientY as number
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
                else if (this.evCache.length < 2 && prevDiff != -1) {
                  prevDiff = -1;
                }
            }
        }

        let pointerup_handler = (ev: PointerEvent | Event) => {
            if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
                // Remove this pointer from the cache and reset the target's
                // background and border
                remove_event(ev);
                
                // If the number of pointers down is less than two then reset diff tracker
                if (this.evCache.length < 2) prevDiff = -1;

                if (this.mainTouchEventId == ev.pointerId) {
                  this.mainTouchEventId = undefined;
                }
            }
        }

        let remove_event = (ev: PointerEvent) => {
            // Remove this event from the target's cache
            for (let i = 0; i < this.evCache.length; i++) {
                if (this.evCache[i].pointerId == ev.pointerId) {
                    this.evCache.splice(i, 1);
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