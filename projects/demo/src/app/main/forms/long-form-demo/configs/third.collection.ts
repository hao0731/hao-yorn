import { IfElementOptions, IfCollectionsOptions, ClassType } from 'forms';
import { ElementType } from './../../../../types/form.type';

const ContactNameInput: IfElementOptions<string> = {
    idx: 1,
    key: 'contactName',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Contact name',
        placeholder: 'Enter name...'
    }
};

const ContactJobInput: IfElementOptions<string> = {
    idx: 2,
    key: 'job',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Job',
        placeholder: 'Enter job...'
    }
};

const ContactPhoneInput: IfElementOptions<string> = {
    idx: 3,
    key: 'phone',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'Tel',
        placeholder: 'Enter phone number...'
    }
};

const ContactEmailInput: IfElementOptions<string> = {
    idx: 4,
    key: 'email',
    elementType: ElementType.INPUT_EMAIL,
    value: '',
    validations: {
        required: true
    },
    configs: {
        label: 'email',
        placeholder: 'Enter email...'
    }
};

const ContactSameAsCheckbox: IfElementOptions<boolean> = {
    idx: 5,
    key: 'sameAs',
    elementType: ElementType.INPUT_CHECKBOX,
    value: false,
    configs: {
        placeholder: 'Same as Second Block'
    }
};

export const LongThirdCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'third-collection',
        configs: {
            label: 'Third Block',
            classList: ['col-6', 'card']
        },
        elements: [
            ContactNameInput,
            ContactJobInput,
            ContactPhoneInput,
            ContactEmailInput,
            ContactSameAsCheckbox
        ]
    } as IfCollectionsOptions
};
