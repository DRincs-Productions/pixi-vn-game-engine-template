import { LabelProps, RegisteredLabels, StepLabelType } from "@drincs/pixi-vn";
import Label from "../classes/Label";

/**
 * Creates a new label and registers it in the system.
 * **This function must be called at least once at system startup to register the label, otherwise the system cannot be used.**
 * @param id The id of the label, it must be unique
 * @param steps The steps of the label
 * @param props The properties of the label
 * @returns The created label
 */
export function newLabel<T extends {} = {}>(
    id: string,
    steps: StepLabelType<T>[] | (() => StepLabelType<T>[]),
    props?: Omit<LabelProps<Label<T>>, "choiseIndex">
): Label<T> {
    if (RegisteredLabels.get(id)) {
        console.info(`Label ${id} already exists, it will be overwritten`);
    }
    let label = new Label<T>(id, steps, props);
    RegisteredLabels.add(label);
    return label;
}
