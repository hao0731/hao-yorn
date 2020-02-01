import { IfElementOptions, IfCollectionsOptions, ClassType } from 'forms';
import { ElementType } from './../../../../types/form.type';

const StoreNameInput: IfElementOptions<string> = {
    idx: 1,
    key: 'name',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Store name',
        placeholder: 'Enter name...'
    }
};

const StorePhoneInput: IfElementOptions<string> = {
    idx: 2,
    key: 'phone',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Store tel',
        placeholder: 'Enter phone number...'
    }
};

const StoreAddressInput: IfElementOptions<string> = {
    idx: 3,
    key: 'address',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Store address',
        placeholder: 'Enter address...'
    }
};

const StoreContactAddressInput: IfElementOptions<string> = {
    idx: 4,
    key: 'contactAddress',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Store Contact Tel',
        placeholder: 'Enter phone number...'
    }
};

const StoreSameAsAddressInput: IfElementOptions<boolean> = {
    idx: 5,
    key: 'sameAs',
    elementType: ElementType.INPUT_CHECKBOX,
    value: false,
    configs: {
        placeholder: 'Same as address'
    }
};

export const LongForthCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'forth-collection',
        configs: {
            label: 'Forth Block',
            classList: ['col-12', 'card']
        },
        elements: [
            StoreNameInput,
            StorePhoneInput,
            StoreAddressInput,
            StoreContactAddressInput,
            StoreSameAsAddressInput
        ]
    } as IfCollectionsOptions
};
