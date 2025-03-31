import {
    canvas,
    CanvasManagerStatic,
    GameUnifier,
    HistoryManagerStatic,
    narration,
    NarrationManagerStatic,
    sound,
    storage,
    StorageManagerStatic,
} from "@drincs/pixi-vn";

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
        GameUnifier.initialize({
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
                return history.add(historyInfo, opstions);
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
        return await canvas.initialize(element, options, devtoolsOptions);
    }

    /**
     * Clear all game data. This function is used to reset the game.
     */
    export function clear() {
        storage.clear();
        canvas.clear();
        sound.clear();
        narration.clear();
        history.clear();
    }

    /**
     * Get all the game data. It can be used to save the game.
     * @returns The game data
     */
    export function exportGameState(): GameState {
        return {
            pixivn_version: PIXIVN_VERSION,
            stepData: narration.export(),
            storageData: storage.export(),
            canvasData: canvas.export(),
            soundData: sound.export(),
            historyData: history.export(),
            path: getGamePath(),
        };
    }

    /**
     * Load the save data
     * @param data The save data
     * @param navigate The function to navigate to a path
     */
    export async function restoreGameState(data: GameState, navigate: (path: string) => void) {
        if (data.stepData.hasOwnProperty("stepsHistory") && data.stepData.stepsHistory) {
            data.historyData.stepsHistory = data.stepData.stepsHistory;
        }
        if (data.stepData.hasOwnProperty("originalStepData") && data.stepData.originalStepData) {
            data.historyData.originalStepData = data.stepData.originalStepData;
        }
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

export default {
    canvas: canvas,
    narration: narration,
    sound: sound,
    storage: storage,
    Game,
    GameUnifier,
};
