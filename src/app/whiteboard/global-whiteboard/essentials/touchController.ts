import { Point } from './../interfaces/point';
import { getAngle, getDistance, inRange } from './utils';

export interface TouchControllerEvents {
    touchStart: (point: Point) => void,
    touchMove: (from: Point, to: Point) => void,
    touchEnd: (point: Point) => void,
    stylusStart: (point: Point) => void,
    stylusMove: (from: Point, to: Point) => void,
    stylusEnd: (point: Point) => void,
    stylusBarrelStart?: (point: Point) => void,
    stylusBarrelMove?: (from: Point, to: Point) => void,
    stylusBarrelEnd?: (point: Point) => void,
    stylusEraseStart?: (point: Point) => void,
    stylusEraseMove?: (from: Point, to: Point) => void,
    stylusEraseEnd?: (point: Point) => void,
    mouseStart: (point: Point) => void,
    mouseMove: (from: Point, to: Point) => void,
    mouseEnd: (point: Point) => void,
    pinchZoom?: (factor: number, point: Point) => void,
    pinchTurn?: (angle: number, point: Point) => void
}

// this class is able to catch events fired in HTML or SVG elements and can distinguish between touch, mouse and stylus
export class TouchController {
    constructor (public touchControllerEvents: TouchControllerEvents, public readonly element: HTMLElement | SVGElement, public readonly relativeTo?: HTMLElement | SVGElement, public readonly anotherElement?: HTMLElement | SVGElement | Document) {
        this.captureEvents();

        if (this.touchControllerEvents.pinchZoom || this.touchControllerEvents.pinchTurn) {
            this.capturePinchEvents();
        }
    }

    private mainTouchEventId: number | undefined;
    private evCache: PointerEvent[] = [];

    private captureEvents() {
        
        let getPosFromPointerEvent = (e: PointerEvent): Point => {
            const rect = this.getBoundingRect();

            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        let lastPoint: Point | undefined;

        let ongoingTouch: boolean = false;

        let checkWhetherPointIsValid = (p: Point): boolean => {
            // this function checks whether the distance is valid
            const maxDistance = Number.MAX_VALUE;
            return lastPoint == undefined || inRange(getDistance(lastPoint, p), -maxDistance, maxDistance);
        }

        const barrelButtons = 2;
        const eraseButtons = 32;
        const barrelButton = 2;
        const eraseButton = 5;

        let start = (e: PointerEvent | Event) => {
            if (!ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                switch (e.pointerType) {
                    case 'pen': {
                        if ((e.button == barrelButton || e.buttons == barrelButtons) && this.touchControllerEvents.stylusBarrelStart) {
                            this.touchControllerEvents.stylusBarrelStart(point);
                        }
                        else if ((e.button == eraseButton || e.buttons == eraseButtons) && this.touchControllerEvents.stylusEraseStart) {
                            this.touchControllerEvents.stylusEraseStart(point);
                        }
                        else {
                            this.touchControllerEvents.stylusStart(point);
                        }
                        break;
                    }
                    case 'mouse': this.touchControllerEvents.mouseStart(point); break;
                    case 'touch': {
                        if (this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) this.touchControllerEvents.touchStart(point); break;
                    }
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
                
                if (checkWhetherPointIsValid(point)) {
                    if (lastPoint != undefined) {
                        switch (e.pointerType) {
                            case 'pen': {
                                if ((e.button == barrelButton || e.buttons == barrelButtons) && this.touchControllerEvents.stylusBarrelMove) {
                                    this.touchControllerEvents.stylusBarrelMove(lastPoint, point);
                                }
                                else if ((e.button == eraseButton || e.buttons == eraseButtons) && this.touchControllerEvents.stylusEraseMove) {
                                    this.touchControllerEvents.stylusEraseMove(lastPoint, point);
                                }
                                else {
                                    this.touchControllerEvents.stylusMove(lastPoint, point);
                                }
                                break;
                            }
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
        }

        let end = (e: PointerEvent | Event) => {
            if (ongoingTouch && e instanceof PointerEvent) {
                let point = getPosFromPointerEvent(e);
                
                if (checkWhetherPointIsValid(point)) {
                    switch (e.pointerType) {
                        case 'pen': {
                            if ((e.button == barrelButton || e.buttons == barrelButtons) && this.touchControllerEvents.stylusBarrelEnd) {
                                this.touchControllerEvents.stylusBarrelEnd(point);
                            }
                            else if ((e.button == eraseButton || e.buttons == eraseButtons) && this.touchControllerEvents.stylusEraseEnd) {
                                this.touchControllerEvents.stylusEraseEnd(point);
                            }
                            else {
                                this.touchControllerEvents.stylusEnd(point);
                            }
                            break;
                        }
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
        }

        let endEl = this.anotherElement ? this.anotherElement : this.element;

        this.element.addEventListener('pointerdown', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            start(ev);
        })
        this.element.addEventListener('pointermove', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            move(ev);
        })
        endEl.addEventListener('pointerup', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            end(ev);
        })
        this.element.addEventListener('pointerup', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            end(ev);
        })
        endEl.addEventListener('pointerleave', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            end(ev);
        })
        endEl.addEventListener('pointercancel', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            end(ev);
        })
        this.element.addEventListener('pointerout', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            return;
        })
        this.element.addEventListener('pointerover', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            return;
        })
        this.element.addEventListener('pointerenter', (ev: PointerEvent | Event) => {
            ev.preventDefault();
            return;
        })

        this.element.addEventListener('contextmenu', (ev: Event) => {
            ev.preventDefault();
        })

        if (this.anotherElement) {
            this.anotherElement.addEventListener('pointermove', (ev: PointerEvent | Event) => {
                ev.preventDefault();
                move(ev);
            })
        }
    }
    
    private capturePinchEvents() {
        // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html 

        // Global vars to cache event state
        let prevDiff = -1;
        let prevAngle: number | undefined;

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

                    let curAngle = getAngle(p0, p1);

                    const rect = this.getBoundingRect();
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


                    if (prevAngle != undefined && curAngle != prevAngle && this.touchControllerEvents.pinchTurn) {
                        // turn around
                        this.touchControllerEvents.pinchTurn(prevAngle - curAngle, averageP);
                    }

                    // Cache the distance for the next move event 
                    prevDiff = curDiff;
                    prevAngle = curAngle;
                }
                else if (this.evCache.length < 2) { 
                    prevDiff = -1;
                    prevAngle = undefined;
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

    private getBoundingRect(): DOMRect {
        if (this.relativeTo) {
            return this.relativeTo.getBoundingClientRect() as DOMRect;
        }
        return this.element.getBoundingClientRect() as DOMRect;
    }

}