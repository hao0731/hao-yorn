import { FormElement } from './element.model';
import { FormElementGroup } from './group.model';
import { ElementsBase } from './base.model';
import { IfCollectionsOptions } from '../types/options.type';

export class FormElementCollection extends ElementsBase {

    public elements: Array<FormElement<any> | FormElementGroup<any>>;

    constructor(options: IfCollectionsOptions) {
        super(options);
        this.sortElements();
        this.setElementsParent(this);
    }

}
