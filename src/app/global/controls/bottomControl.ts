import { Input } from "@angular/core";
import { BoardService } from "../../features/board.service";
import { Board } from "../board/board";
import { Event } from "../event";
import { BasicControl } from "./basicControl";

export abstract class BottomControl extends BasicControl {

    public active: boolean = false;

    public onClick = () => {
        if (this.isOpen()) {
            this.active = !this.active;
        }
        else {
            this.active = false;
            this.secondClick();
        }
    }

    public abstract isOpen: () => boolean;

    protected abstract secondClick: () => void;

    constructor() {
        super();
        
        this.afterViewInit.addListener(() => {
            this.board.onTouch.addListener(() => {
                this.active = false;
            })
        })
    }
}