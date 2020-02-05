import { IfElementOptions, IfCollectionsOptions, ClassType } from 'forms';
import { ElementType } from './../../../../types/form.type';

const AddNameInput: IfElementOptions<string> = {
    idx: 1,
    key: 'name',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'name',
        placeholder: 'Enter name...'
    }
};

export const AddFirstCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'first-collection',
        configs: {
            label: 'First Block',
            classList: ['col-12', 'card']
        },
        elements: [
            AddNameInput
        ]
    } as IfCollectionsOptions
};
