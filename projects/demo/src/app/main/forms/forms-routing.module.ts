import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: 'builder',
        loadChildren: () => import('./form-builder-demo/form-builder-demo.module').then(mod => mod.FormBuilderDemoModule)
    },
    {
        path: 'long',
        loadChildren: () => import('./long-form-demo/long-form-demo.module').then(mod => mod.LongFormDemoModule)
    },
    {
        path: 'add',
        loadChildren: () => import('./form-add-demo/form-add-demo.module').then(mod => mod.FormAddDemoModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
