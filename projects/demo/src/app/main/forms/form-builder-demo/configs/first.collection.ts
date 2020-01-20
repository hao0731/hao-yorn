import { IfCollectionsOptions, IfElementOptions, ClassType } from 'forms';
import { ElementType } from '../../../../types/form.type';

const NameInput = {
    idx: 1,
    key: 'name',
    elementType: ElementType.INPUT_TEXT,
    value: '',
    validations: {
        required: true,
        minLength: 3,
        maxLength: 10
    },
    configs: {
        label: 'Name',
        placeholder: 'Enter name...',
        classList: ['element', 'username']
    }
} as IfElementOptions<string>;

const EmailInput = {
    idx: 2,
    key: 'email',
    elementType: ElementType.INPUT_EMAIL,
    value: '',
    validations: {
        required: true,
        pattern: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    },
    configs: {
        label: 'Email',
        placeholder: 'Enter email...',
        classList: ['element', 'email']
    }
} as IfElementOptions<string>;

const PasswordInput = {
    idx: 3,
    key: 'password',
    elementType: ElementType.INPUT_PASSWORD,
    value: '',
    validations: {
        minLength: 8,
        maxLength: 20
    },
    configs: {
        label: 'Password',
        placeholder: 'Enter password...',
        classList: ['element', 'password']
    }
} as IfElementOptions<string>;

export const FirstCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'first-collection',
        configs: {
            label: 'First Block',
            classList: ['collection']
        },
        elements: [
            NameInput,
            EmailInput,
            PasswordInput
        ]
    } as IfCollectionsOptions
};
