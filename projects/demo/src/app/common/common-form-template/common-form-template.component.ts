import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormFrame, FormElement, FormElementGroup, FormElementCollection } from 'forms';

import { ElementType } from './../../types/form.type';

@Component({
    selector: 'app-common-form-template',
    templateUrl: './common-form-template.component.html',
    styleUrls: ['./common-form-template.component.scss']
})
export class CommonFormTemplateComponent implements OnInit, OnDestroy {

    public formFrame: FormFrame;
    public form: FormGroup;

    public isReady = false;

    public elementType = ElementType;

    constructor() { }

    // =====================================================================================
    // @ Lifecycle hooks
    // =====================================================================================

    ngOnInit(): void {
        this.initial();
    }

    ngOnDestroy(): void {
        this.formFrame.destroy();
    }

    // =====================================================================================
    // @ Abstract Methods
    // =====================================================================================

    protected initial(): void { }

    // =====================================================================================
    // @ Protected Methods
    // =====================================================================================

    protected ready(): void {
        this.isReady = true;
    }

    // =====================================================================================
    // @ Public Methods
    // =====================================================================================

    public getElementInstance(elem: FormElement<any> | FormElementGroup<any> | FormElementCollection ): FormElement<any> {
        return elem instanceof FormElement ? elem : null;
    }

    public getGroupInstance(elem: FormElement<any> | FormElementGroup<any> | FormElementCollection ): FormElementGroup<any> {
        return elem instanceof FormElementGroup ? elem : null;
    }

    public getCollectionInstance(elem: FormElement<any> | FormElementGroup<any> | FormElementCollection ): FormElementCollection {
        return elem instanceof FormElementCollection ? elem : null;
    }

}
