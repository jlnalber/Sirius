import { Point } from './../interfaces/point';
import { getAngle, getDistance, inRange } from './utils';

const barrelButtons = 2;
const eraseButtons = 32;
const barrelButton = 2;
const eraseButton = 5;

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
    pinchTurn?: (angle: number, point: Point) => void,
    endPinch?: () => void,
    mouseWheel?: (by: number, point: Point) => void
}

// this class is able to catch events fired in HTML or SVG elements and can distinguish between touch, mouse and stylus
export class TouchController {
    constructor (public touchControllerEvents: TouchControllerEvents, public readonly element: HTMLElement | SVGElement, public readonly relativeTo?: HTMLElement | SVGElement, public readonly anotherElement?: HTMLElement | SVGElement | Document) {
        this.captureEvents();

        if (this.touchControllerEvents.pinchZoom || this.touchControllerEvents.pinchTurn) {
            this.capturePinchEvents();
        }
        
        if (this.touchControllerEvents.mouseWheel) {
            this.captureWheelEvents();
        }
    }

    public stop() {
        this.removeEvents();

        if (this.touchControllerEvents.pinchZoom || this.touchControllerEvents.pinchTurn) {
            this.removePinchEvents();
        }

        if (this.touchControllerEvents.mouseWheel) {
            this.removeWheelEvents();
        }
    }

    // #region the functions to be executed in the events
    
    private getPosFromPointerEvent = (e: PointerEvent): Point => {
        const rect = this.getBoundingRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    private lastPoint: Point | undefined;
    private currentPointerID?: number;
    private ongoingTouch: boolean = false;
    private ongoingStylusID?: number;

    private checkWhetherPointIsValid = (p: Point): boolean => {
        // this function checks whether the distance is valid
        const maxDistance = Number.MAX_VALUE;
        return this.lastPoint == undefined || inRange(getDistance(this.lastPoint, p), -maxDistance, maxDistance);
    }

    private start = (e: PointerEvent | Event) => {

        if (e instanceof PointerEvent && (!this.ongoingTouch || e.pointerType == 'pen')) {

            this.ongoingStylusID = e.pointerType == 'pen' ? e.pointerId : undefined;

            let point = this.getPosFromPointerEvent(e);
            
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
                this.lastPoint = point;
            }
            this.ongoingTouch = true;
            this.currentPointerID = e.pointerId;
        }
    }

    private move = (e: PointerEvent | Event) => {
        if (this.ongoingTouch && e instanceof PointerEvent && (!this.ongoingStylusID && e.pointerType != 'pen' || e.pointerId == this.ongoingStylusID)) {

            let point = this.getPosFromPointerEvent(e);
            
            if (this.checkWhetherPointIsValid(point)) {
                if (this.lastPoint != undefined) {
                    switch (e.pointerType) {
                        case 'pen': {
                            if ((e.button == barrelButton || e.buttons == barrelButtons) && this.touchControllerEvents.stylusBarrelMove) {
                                this.touchControllerEvents.stylusBarrelMove(this.lastPoint, point);
                            }
                            else if ((e.button == eraseButton || e.buttons == eraseButtons) && this.touchControllerEvents.stylusEraseMove) {
                                this.touchControllerEvents.stylusEraseMove(this.lastPoint, point);
                            }
                            else {
                                this.touchControllerEvents.stylusMove(this.lastPoint, point);
                            }
                            break;
                        }
                        case 'mouse': this.touchControllerEvents.mouseMove(this.lastPoint, point); break;
                        case 'touch': if (this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) this.touchControllerEvents.touchMove(this.lastPoint, point); break;
                    }
                }

                if (e.pointerType != 'touch' || this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId) {
                    this.lastPoint = point;
                }

                if (e instanceof PointerEvent && e.pointerType == 'touch' && this.mainTouchEventId == undefined) {
                    this.mainTouchEventId = e.pointerId;
                }

                if (this.currentPointerID == undefined) {
                    this.currentPointerID = e.pointerId;
                }
            }
        }
    }

    private end = (e: PointerEvent | Event) => {
        if (this.ongoingTouch && e instanceof PointerEvent && (!this.ongoingStylusID && e.pointerType != 'pen' || e.pointerId == this.ongoingStylusID)) {
            let point = this.getPosFromPointerEvent(e);
            
            if (this.checkWhetherPointIsValid(point)) {
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

                if (e instanceof PointerEvent && (e.pointerType != 'touch' || this.mainTouchEventId == undefined || this.mainTouchEventId == e.pointerId)) {
                    this.lastPoint = undefined;
                    if (this.evCache.length < 1) {
                        this.ongoingTouch = false;
                    }
                }
            }

            //console.log(this.evCache)
            this.currentPointerID = undefined;
            this.ongoingStylusID = undefined;
        }
    }

    private startListener = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        this.start(ev);
    }

    private moveListener = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        this.move(ev);
    }

    private endListener = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        this.end(ev);
    }

    private preventListener = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        return;
    }
    // #endregion

    private captureEvents() {

        let endEl = this.anotherElement ? this.anotherElement : this.element;

        this.element.addEventListener('pointerdown', this.startListener)
        this.element.addEventListener('pointermove', this.moveListener)
        endEl.addEventListener('pointerup', this.endListener)
        this.element.addEventListener('pointerup', this.endListener)
        endEl.addEventListener('pointerleave', this.endListener)
        endEl.addEventListener('pointercancel', this.endListener)
        this.element.addEventListener('pointerout', this.preventListener)
        this.element.addEventListener('pointerover', this.preventListener)
        this.element.addEventListener('pointerenter', this.preventListener)

        this.element.addEventListener('contextmenu', this.preventListener)

        if (this.anotherElement) {
            this.anotherElement.addEventListener('pointermove', this.moveListener)
        }

    }

    private removeEvents() {

        let endEl = this.anotherElement ? this.anotherElement : this.element;

        this.element.removeEventListener('pointerdown', this.startListener)
        this.element.removeEventListener('pointermove', this.moveListener)
        endEl.removeEventListener('pointerup', this.endListener)
        this.element.removeEventListener('pointerup', this.endListener)
        endEl.removeEventListener('pointerleave', this.endListener)
        endEl.removeEventListener('pointercancel', this.endListener)
        this.element.removeEventListener('pointerout', this.preventListener)
        this.element.removeEventListener('pointerover', this.preventListener)
        this.element.removeEventListener('pointerenter', this.preventListener)

        this.element.removeEventListener('contextmenu', this.preventListener)

        if (this.anotherElement) {
            this.anotherElement.removeEventListener('pointermove', this.moveListener)
        }

    }


    // #region the functions to be executed in the pinch events

    // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html 

    // Global vars to cache event state
    private mainTouchEventId: number | undefined;
    private evCache: PointerEvent[] = [];
    private prevDiff = -1;
    private prevAngle: number | undefined;

    private pointerdown_handler = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
            // The pointerdown event signals the start of a touch interaction.
            // This event is cached to support 2-finger gestures
            this.evCache.push(ev);

            if (this.mainTouchEventId == undefined) {
                this.mainTouchEventId = ev.pointerId;
            }
        }
    }

    private pointermove_handler = (ev: PointerEvent | Event) => {
        ev.preventDefault();
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

                if (this.prevDiff > 0 && curDiff > 0 && this.touchControllerEvents.pinchZoom) {
                    // zoom to the middle by the amount that was scrolled
                    this.touchControllerEvents.pinchZoom(curDiff / this.prevDiff, averageP);
                    /*if (curDiff > prevDiff) {
                        // The distance between the two pointers has increased
                    }
                    if (curDiff < prevDiff) {
                        // The distance between the two pointers has decreased
                    }*/
                }


                if (this.prevAngle != undefined && curAngle != this.prevAngle && this.touchControllerEvents.pinchTurn) {
                    // turn around
                    this.touchControllerEvents.pinchTurn(curAngle - this.prevAngle, averageP);
                }

                // Cache the distance for the next move event 
                this.prevDiff = curDiff;
                this.prevAngle = curAngle;
            }
            else if (this.evCache.length < 2) { 
                this.prevDiff = -1;
                this.prevAngle = undefined;
            }
        }
    }

    private pointerup_handler = (ev: PointerEvent | Event) => {
        ev.preventDefault();
        if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
            // Remove this pointer from the cache and reset the target's
            // background and border
            this.remove_event(ev);
            
            // If the number of pointers down is less than two then reset diff tracker
            if (this.evCache.length < 2) {
                this.prevDiff = -1;
                this.prevAngle = undefined;
                if (this.touchControllerEvents.endPinch) {
                    this.touchControllerEvents.endPinch();
                }
            }

            if (this.mainTouchEventId == ev.pointerId) {
                this.mainTouchEventId = undefined;
            }
        }
    }

    private remove_event = (ev: PointerEvent) => {
        // Remove this event from the target's cache
        for (let i = 0; i < this.evCache.length; i++) {
            if (this.evCache[i].pointerId == ev.pointerId) {
                this.evCache.splice(i, 1);
                break;
            }
        }
    }

    // #endregion
    
    private capturePinchEvents() {

        this.element.addEventListener('pointerdown', this.pointerdown_handler);
        this.element.addEventListener('pointermove', this.pointermove_handler);

        // Use same handler for pointer{up,cancel,out,leave} events since
        // the semantics for these events - in this app - are the same.
        this.element.addEventListener('pointerup', this.pointerup_handler);
        this.element.addEventListener('pointercancel', this.pointerup_handler);
        this.element.addEventListener('pointerout', this.pointerup_handler);
        this.element.addEventListener('pointerleave', this.pointerup_handler);
    }

    private removePinchEvents() {

        this.element.removeEventListener('pointerdown', this.pointerdown_handler);
        this.element.removeEventListener('pointermove', this.pointermove_handler);

        // Use same handler for pointer{up,cancel,out,leave} events since
        // the semantics for these events - in this app - are the same.
        this.element.removeEventListener('pointerup', this.pointerup_handler);
        this.element.removeEventListener('pointercancel', this.pointerup_handler);
        this.element.removeEventListener('pointerout', this.pointerup_handler);
        this.element.removeEventListener('pointerleave', this.pointerup_handler);
    }


    // #region the functions to be executed in the mouse wheel event
    private getPosFromWheelEvent = (e: WheelEvent): Point => {
        const rect = this.getBoundingRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    private mouseWheelHandler = (ev: WheelEvent | Event) => {
        if (this.touchControllerEvents.mouseWheel && ev instanceof WheelEvent) {
            ev.preventDefault();
            let p = this.getPosFromWheelEvent(ev);
            let by = Math.sqrt(ev.deltaY ** 2 + ev.deltaX ** 2 + ev.deltaZ ** 2) * Math.sign((ev.deltaX ? ev.deltaX : 1) * (ev.deltaY ? ev.deltaY : 1) * (ev.deltaZ ? ev.deltaZ : 1));
            this.touchControllerEvents.mouseWheel(by, p);
        }
    }
    // #endregion

    private captureWheelEvents(): void {
        this.element.addEventListener('wheel', this.mouseWheelHandler);
    }

    private removeWheelEvents(): void {
        this.element.removeEventListener('wheel', this.mouseWheelHandler);
    }


    private getBoundingRect(): DOMRect {
        if (this.relativeTo) {
            return this.relativeTo.getBoundingClientRect() as DOMRect;
        }
        return this.element.getBoundingClientRect() as DOMRect;
    }

}