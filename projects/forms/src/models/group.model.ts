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
        this.elements.push(element);
        this.sortElements();
    }

    public removeElement(key: string): void {
        this.elements = this.elements.filter(x => x.key !== key);
        this.sortElements();
    }

}
