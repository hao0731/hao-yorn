import { Component } from '@angular/core';

import { cloneDeep } from 'lodash';

import { FormFrame, ElementsBuilder, FormElement, FormElementCollection, FormElementGroup, IfRelation, RelationMethod } from 'forms';

import { CommonFormTemplateComponent } from '../../../common/common-form-template/common-form-template.component';

import { AddFormFields } from './configs/collection';
import { ElementType } from '../../../types/form.type';

@Component({
    selector: 'app-form-add-demo',
    templateUrl: '../../../common/common-form-template/common-form-template.component.html',
    styleUrls: [
        './form-add-demo.component.scss',
        '../../../common/common-form-template/common-form-template.component.scss'
    ]
})
export class FormAddDemoComponent extends CommonFormTemplateComponent {

    constructor() {
        super();
    }

    protected initial(): void {
        this.formFrame = new FormFrame({ elements: ElementsBuilder.create(cloneDeep(AddFormFields)) });
        this.form = this.formFrame.form;
        this.ready();
        setTimeout(() => {
            this.addElement();
            this.addCollection();
            this.defineRelation();
            this.removeElement();
        });
    }

    private addElement(): void {
        const elements = this.formFrame.elements;
        const idx = elements[elements.length - 1].idx + 1;
        const element = new FormElement(
            {
                idx,
                key: 'newInput',
                value: '',
                elementType: ElementType.INPUT_TEXT,
                configs: { placeholder: 'new input...' }
            }
        );
        this.formFrame.addElement(element, (elements[0] as FormElementCollection));
    }

    private addCollection(): void {
        const element = new FormElementCollection(
            {
                idx: 1,
                key: 'newCollection',
                configs: {
                    label: 'New Block',
                    classList: ['col-12', 'card']
                },
                elements: [
                    new FormElement(
                        {
                            idx: 1,
                            key: 'newInput',
                            value: '',
                            elementType: ElementType.INPUT_TEXT,
                            configs: {
                                label: 'new',
                                placeholder: 'new input...'
                            }
                        }
                    ),
                    new FormElementGroup(
                        {
                            idx: 2,
                            key: 'newGroup',
                            configs: {
                                label: 'New Group'
                            },
                            elements: [
                                new FormElement(
                                    {
                                        idx: 1,
                                        key: 'newInput',
                                        value: '',
                                        elementType: ElementType.INPUT_TEXT,
                                        configs: {
                                            placeholder: 'group input...'
                                        }
                                    }
                                )
                            ]
                        }
                    )
                ]
            }
        );
        this.formFrame.addElement(element);
    }

    private removeElement(): void {
        const collection = this.formFrame.elements.find(x => x.key === 'newCollection') as FormElementCollection;
        const group = collection.elements.find(x => x.key === 'newGroup') as FormElementGroup<string>;
        const element = group.elements.find(x => x.idx === 1);
        this.formFrame.removeElement(collection);
    }

    private defineRelation(): void {
        const relationList: IfRelation[] = [
            {
                idx: 1,
                base: ['newCollection', 'newInput'],
                targets: [['first-collection', 'name']],
                method: RelationMethod.TWO_WAY_BINDING
            }
        ];
        this.formFrame.setFieldRelations(relationList);
    }

}
