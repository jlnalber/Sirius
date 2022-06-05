import { BasicControl } from "./basicControl";

export abstract class BottomControl extends BasicControl {

    public cardOpen: boolean = false;

    public onClick = () => {
        if (this.isActive()) {
            this.cardOpen = !this.cardOpen;
            if (this.firstClick) {
                this.firstClick();
            }
        }
        else {
            this.cardOpen = false;
            this.secondClick();
        }
    }

    public override getNgClasses(): string {
        return (this.isActive() ? 'active' : 'inactive') + ' ' + (this.isEnabled() ? 'enabled' : 'disabled');
    }

    public abstract isActive: () => boolean;

    protected abstract secondClick: () => void;

    protected abstract firstClick?: () => void;

    constructor() {
        super();
        
        this.afterViewInit.addListener(() => {
            this.board.onMouse.addListener(() => {
                this.cardOpen = false;
            })
            this.board.onTouch.addListener(() => {
                this.cardOpen = false;
            })
            this.board.onBoardAnyModeChange.addListener(() => {
                this.cardOpen = false;
            })
        })
    }
}