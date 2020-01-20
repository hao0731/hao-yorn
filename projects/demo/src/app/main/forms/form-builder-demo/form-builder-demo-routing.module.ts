import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormBuilderDemoComponent } from './form-builder-demo.component';


const routes: Routes = [
    {
        path: '',
        component: FormBuilderDemoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormBuilderDemoRoutingModule { }
