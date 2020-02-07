import { Component } from '@angular/core';

import { cloneDeep, isEqual } from 'lodash';

import { FormFrame, ElementsBuilder, IfRelation, RelationMethod } from 'forms';

import { CommonFormTemplateComponent } from './../../../common/common-form-template/common-form-template.component';
import { LongFormFields } from './configs/collections';

@Component({
    selector: 'app-long-form-demo',
    templateUrl: './long-form-demo.component.html',
    styleUrls: ['./long-form-demo.component.scss']
})
export class LongFormDemoComponent extends CommonFormTemplateComponent {

    constructor() {
        super();
    }

    protected initial(): void {
        this.formFrame = new FormFrame({ elements: ElementsBuilder.create(cloneDeep(LongFormFields)) });
        this.form = this.formFrame.form;
        this.defineRelation();
        this.ready();
    }

    public onSubmit(): void {}

    private defineRelation(): void {
        const relationList: IfRelation[] = [
            {
                idx: 1,
                base: ['second-collection'],
                targets: [['third-collection']],
                method: RelationMethod.TWO_WAY_BINDING,
                options: {
                    conditionFunc: () => this.form.get(['third-collection', 'sameAs']).value
                }
            },
            {
                idx: 3,
                base: ['forth-collection', 'address'],
                targets: [['forth-collection', 'contactAddress']],
                method: RelationMethod.TWO_WAY_BINDING,
                options: {
                    conditionFunc: () => this.form.get(['forth-collection', 'sameAs']).value
                }
            }
        ];
        this.formFrame.setFieldRelations(relationList);
    }

}
