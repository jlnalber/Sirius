import { Event } from "./event";

type HandlerType<T> = (() => T) | undefined;

export class Handler<T> {

    public readonly onHandlerChanged: Event = new Event();

    private _handler: HandlerType<T>;
    public set handler(value: HandlerType<T>) {
        this._handler = value;
        this.onHandlerChanged.emit();
    }
    public get handler(): HandlerType<T> {
        return this._handler;
    }
}