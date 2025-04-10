import PIXIVN, {
    canvas,
    CanvasManagerStatic,
    GameUnifier,
    HistoryManagerStatic,
    narration,
    NarrationManagerStatic,
    sound,
    stepHistory,
    storage,
    StorageManagerStatic,
} from "@drincs/pixi-vn";
import { Devtools } from "@pixi/devtools";
import { ApplicationOptions } from "pixi.js";
import { version as ENGINE_VERSION } from "../package.json";
import { GameState } from "./interfaces";
import { getGamePath } from "./utils/path-utility";
export { version as ENGINE_VERSION } from "../package.json";
export * from "./interfaces";
export * from "./utils";

export namespace Game {
    /**
     * Initialize the Game and PixiJS Application and the interface div.
     * This method should be called before any other method.
     * @param element The html element where I will put the canvas. Example: document.body
     * @param width The width of the canvas
     * @param height The height of the canvas
     * @param options The options of PixiJS Application
     * @param devtoolsOptions The options of the devtools. You can read more about it in the [PixiJS Devtools documentation](https://pixijs.io/devtools/docs/plugin/)
     * @example
     * ```typescript
     * const body = document.body
     * if (!body) {
     *     throw new Error('body element not found')
     * }
     * await Game.initialize(body, {
     *     width: 1920,
     *     height: 1080,
     *     backgroundColor: "#303030"
     * })
     * ```
     */
    export async function initialize(
        element: HTMLElement,
        options: Partial<ApplicationOptions> & { width: number; height: number },
        devtoolsOptions?: Devtools
    ) {
        GameUnifier.init({
            getCurrentGameStepState: () => {
                return {
                    path: getGamePath(),
                    storage: storage.export(),
                    canvas: canvas.export(),
                    sound: sound.export(),
                    labelIndex: NarrationManagerStatic.currentLabelStepIndex || 0,
                    openedLabels: narration.openedLabels,
                };
            },
            restoreGameStepState: async (state, navigate) => {
                HistoryManagerStatic._originalStepData = state;
                NarrationManagerStatic._openedLabels = state.openedLabels;
                storage.restore(state.storage);
                await canvas.restore(state.canvas);
                sound.restore(state.sound);
                navigate(state.path);
            },
            // narration
            getStepCounter: () => narration.stepCounter,
            setStepCounter: (value) => {
                NarrationManagerStatic._stepCounter = value;
            },
            getOpenedLabels: () => narration.openedLabels.length,
            addHistoryItem: (historyInfo, opstions) => {
                return stepHistory.add(historyInfo, opstions);
            },
            getCurrentStepsRunningNumber: () => NarrationManagerStatic.stepsRunning,
            // canvas
            onGoNextEnd: async () => {
                CanvasManagerStatic._tickersToCompleteOnStepEnd.tikersIds.forEach(({ id }) => {
                    canvas.forceCompletionOfTicker(id);
                });
                CanvasManagerStatic._tickersToCompleteOnStepEnd.stepAlias.forEach(({ alias, id }) => {
                    canvas.forceCompletionOfTicker(id, alias);
                });
                CanvasManagerStatic._tickersToCompleteOnStepEnd = { tikersIds: [], stepAlias: [] };
            },
            // storage
            getVariable: (key) => storage.getVariable(key),
            setVariable: (key, value) => storage.setVariable(key, value),
            removeVariable: (key) => storage.removeVariable(key),
            getFlag: (key) => storage.getFlag(key),
            setFlag: (name, value) => storage.setFlag(name, value),
            onLabelClosing: (openedLabelsNumber) => StorageManagerStatic.clearOldTempVariables(openedLabelsNumber),
        });
        return await canvas.init(element, options, devtoolsOptions);
    }

    /**
     * Clear all game data. This function is used to reset the game.
     */
    export function clear() {
        storage.clear();
        canvas.clear();
        sound.clear();
        narration.clear();
        stepHistory.clear();
    }

    /**
     * Get all the game data. It can be used to save the game.
     * @returns The game data
     */
    export function exportGameState(): GameState {
        return {
            engine_version: ENGINE_VERSION,
            stepData: narration.export(),
            storageData: storage.export(),
            canvasData: canvas.export(),
            soundData: sound.export(),
            historyData: stepHistory.export(),
            path: getGamePath(),
        };
    }

    /**
     * Load the save data
     * @param data The save data
     * @param navigate The function to navigate to a path
     */
    export async function restoreGameState(data: GameState, navigate: (path: string) => void) {
        await narration.restore(data.stepData, HistoryManagerStatic.lastHistoryStep);
        storage.restore(data.storageData);
        await canvas.restore(data.canvasData);
        sound.restore(data.soundData);
        navigate(data.path);
    }

    /**
     * Convert a JSON string to a save data
     * @param json The JSON string
     * @returns The save data
     */
    export function jsonToGameState(json: string): GameState {
        return JSON.parse(json);
    }
}

export { Container, ImageContainer, ImageSprite, Sprite, Text, VideoSprite } from "@drincs/pixi-vn";
export { canvas, GameUnifier, narration, PIXIVN, sound, storage };
