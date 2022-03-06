export class Handler<T> {
    public handler: (() => T) | undefined;
}