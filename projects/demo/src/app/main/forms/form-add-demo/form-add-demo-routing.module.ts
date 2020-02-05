import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormAddDemoComponent } from './form-add-demo.component';


const routes: Routes = [
    {
        path: '',
        component: FormAddDemoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormAddDemoRoutingModule { }
