import { Color } from "src/app/whiteboard/global-whiteboard/interfaces/whiteboard";
import { Category } from "./interfaces/fach";

export function colorToHex(color: Color): string {
    let str = '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
    if (color.a != undefined) {
        str += toHex(color.a);
    }
    return str;
}

export function toHex(num: number | null, length: number = 2): string {
    
    let multiply = (s: string, times: number): string => {
        if (times == 0) return '';
        return s + multiply(s, times - 1)
    }
    
    if (num) {
        let str = num.toString(16);

        if (str.length < length) {

            str = multiply('0', length - str.length) + str;
        }
        
        return str;
    }
    return multiply('0', length);
}

export function getNewId(ids: string[], alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ123456789'): string {
    // gibt eine neue Id zurück
    let getRandomLetter = (): string => {
        return alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    }

    let id = getRandomLetter();

    while (ids.indexOf(id) >= 0) {
        id += getRandomLetter();
    }
    return id;
}