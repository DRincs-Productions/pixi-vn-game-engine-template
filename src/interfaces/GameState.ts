import {
    CanvasGameState,
    HistoryGameState,
    NarrationGameState,
    SoundGameState,
    StorageGameState,
} from "@drincs/pixi-vn";

export default interface GameState {
    engine_version: string;
    stepData: NarrationGameState;
    storageData: StorageGameState;
    canvasData: CanvasGameState;
    soundData: SoundGameState;
    historyData: HistoryGameState;
    path: string;
}
