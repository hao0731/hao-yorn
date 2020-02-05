import { NgModule } from '@angular/core';

import { FormAddDemoRoutingModule } from './form-add-demo-routing.module';
import { FormAddDemoComponent } from './form-add-demo.component';
import { CommonFormTemplateModule } from '../../../common/common-form-template/common-form-template.module';


@NgModule({
    declarations: [
        FormAddDemoComponent
    ],
    imports: [
        CommonFormTemplateModule,
        FormAddDemoRoutingModule
    ]
})
export class FormAddDemoModule { }
