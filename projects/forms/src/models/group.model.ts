import { FormElement } from './element.model';
import { ElementsBase } from './base.model';
import { IfGroupOptions } from '../types/options.type';

export class FormElementGroup<T> extends ElementsBase {

    public elements: FormElement<T>[];

    constructor(options: IfGroupOptions<T>) {
        super(options);
        this.sortElements();
        this.setElementsParent(this);
    }

    public addElement(element: FormElement<T>): void {
        super.addElement(element);
    }

}
