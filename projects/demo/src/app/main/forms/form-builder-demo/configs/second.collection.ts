import { ClassType, IfCollectionsOptions, IfGroupOptions } from 'forms';
import { ElementType } from '../../../../types/form.type';

const SkillGroup = {
    idx: 1,
    key: 'skills',
    elements: [
        {
            idx: 1,
            key: '1',
            elementType: ElementType.INPUT_TEXT,
            value: '',
            validations: {
                required: true
            },
            configs: {
                classList: ['element', 'skill']
            }
        },
        {
            idx: 2,
            key: '2',
            elementType: ElementType.INPUT_TEXT,
            value: '',
            validations: {
                required: true
            },
            configs: {
                classList: ['element', 'skill']
            }
        }
    ],
    configs: {
        label: 'Skills',
        classList: ['group']
    }
} as IfGroupOptions<string>;

export const SecondCollection = {
    type: ClassType.COLLECTION,
    param: {
        idx: 1,
        key: 'second-collection',
        configs: {
            label: 'Second Block'
        },
        elements: [
            SkillGroup
        ]
    } as IfCollectionsOptions
};
