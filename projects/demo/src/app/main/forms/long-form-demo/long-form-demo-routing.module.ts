import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LongFormDemoComponent } from './long-form-demo.component';

const routes: Routes = [
    {
        path: '',
        component: LongFormDemoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LongFormDemoRoutingModule { }
