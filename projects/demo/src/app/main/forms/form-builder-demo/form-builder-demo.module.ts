import { NgModule } from '@angular/core';

import { CommonFormTemplateModule } from './../../../common/common-form-template/common-form-template.module';

import { FormBuilderDemoRoutingModule } from './form-builder-demo-routing.module';
import { FormBuilderDemoComponent } from './form-builder-demo.component';


@NgModule({
    declarations: [
        FormBuilderDemoComponent
    ],
    imports: [
        CommonFormTemplateModule,
        FormBuilderDemoRoutingModule
    ]
})
export class FormBuilderDemoModule { }
