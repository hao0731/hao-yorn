import { IfElementOptions, IfCollectionsOptions, ClassType } from 'forms';
import { ElementType } from './../../../../types/form.type';

const NameInput: IfElementOptions<string> = {
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

const AgreeCheckBox: IfElementOptions<boolean> = {
    idx: 2,
    key: 'agree',
    elementType: ElementType.INPUT_CHECKBOX,
    value: true,
    validations: {
        required: true
    },
    configs: {
        disabled: true,
        placeholder: 'Yes, I agree.'
    }
};

const ShowCheckbox1: IfElementOptions<boolean> = {
    idx: 3,
    key: 'show1',
    elementType: ElementType.INPUT_CHECKBOX,
    value: false,
    configs: {
        placeholder: 'Show 1'
    }
};

const ShowCheckbox2: IfElementOptions<boolean> = {
    idx: 4,
    key: 'show2',
    elementType: ElementType.INPUT_CHECKBOX,
    value: false,
    configs: {
        placeholder: 'Show 2'
    }
};

const NumberInput: IfElementOptions<number> = {
    idx: 5,
    key: 'number',
    elementType: ElementType.INPUT_NUMBER,
    value: 0,
    validations: {
        required: true,
        min: 1,
        max: 100
    },
    configs: {
        label: 'number',
        placeholder: 'Enter Number...',
        hidden: true
    }
};

export const LongFirstCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'first-collection',
        configs: {
            label: 'First Block',
            classList: ['col-12', 'card']
        },
        elements: [
            NameInput,
            AgreeCheckBox,
            ShowCheckbox1,
            ShowCheckbox2,
            NumberInput
        ]
    } as IfCollectionsOptions
};
