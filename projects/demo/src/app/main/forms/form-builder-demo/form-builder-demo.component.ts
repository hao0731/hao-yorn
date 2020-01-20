import { Component } from '@angular/core';

import { cloneDeep } from 'lodash';

import { FormFrame, RelationMethod, ElementsBuilder } from 'forms';

import { CommonFormTemplateComponent } from './../../../common/common-form-template/common-form-template.component';
import { Fields } from './configs/fields';

@Component({
  selector: 'app-form-builder-demo',
  templateUrl: '../../../common/common-form-template/common-form-template.component.html',
  styleUrls: [
      './form-builder-demo.component.scss',
      '../../../common/common-form-template/common-form-template.component.scss'
    ]
})
export class FormBuilderDemoComponent extends CommonFormTemplateComponent {

    constructor() {
        super();
    }

    protected initial(): void {
        this.formFrame = new FormFrame({ elements: ElementsBuilder.create(cloneDeep(Fields)) });
        this.form = this.formFrame.form;
        this.formFrame.setFieldRelations([
            {
                idx: 1,
                base: ['first-collection', 'name'],
                targets: [
                    ['second-collection']
                ],
                method: RelationMethod.DISABLED,
                conditionFunc: () => !Boolean(this.form.get(['first-collection', 'name']).value)
            }
        ]);
        this.ready();
    }

}
