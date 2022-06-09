export interface WhiteboardConfig {
    showBottomBar: boolean,
    enableMenuControl: boolean,
    enableSelectControl: boolean,
    enablePenControl: boolean,
    enableDeleteControl: boolean,
    enableMoveControl: boolean,
    enableShapeControl: boolean,
    enableFileControl: boolean,
    enableClearControl: boolean,
    enableBackControl: boolean,
    enableForwardControl: boolean,
    enableNewPageControl: boolean,
    enableLastPageControl: boolean,
    enableNextPageControl: boolean,
    enableStickyNotesControl: boolean,
    enablePagesControl: boolean,
    enableToolsControl: boolean,
    menuControls: WhiteboardMenuControlsConfig
}

export interface WhiteboardMenuControlsConfig {
    fullscreenControl: boolean,
    backgroundControl: boolean,
    formatControl: boolean,
    exportAsPDFControl: boolean,
    exportAsBitmapControl: boolean,
    exportAsSvgControl: boolean,
    saveControl: boolean
}