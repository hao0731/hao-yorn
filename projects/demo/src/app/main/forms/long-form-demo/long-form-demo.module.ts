import { NgModule } from '@angular/core';

import { CommonFormTemplateModule } from '../../../common/common-form-template/common-form-template.module';

import { LongFormDemoRoutingModule } from './long-form-demo-routing.module';
import { LongFormDemoComponent } from './long-form-demo.component';

@NgModule({
    declarations: [LongFormDemoComponent],
    imports: [
        CommonFormTemplateModule,
        LongFormDemoRoutingModule
    ]
})
export class LongFormDemoModule { }
