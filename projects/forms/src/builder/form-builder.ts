import { FormElement } from '../models/element.model';
import { FormElementGroup } from '../models/group.model';
import { FormElementCollection } from '../models/collection.model';
import { IfElementOptions, IfGroupOptions, IfCollectionsOptions } from '../types/options.type';
import { ClassType } from '../types/params.type';

export class ElementsBuilder {

    public static create(
        arr: Array<
            { type: ClassType, param: IfElementOptions<any> } |
            { type: ClassType, param: IfGroupOptions<any> } |
            { type: ClassType, param: IfCollectionsOptions }
        >
    ): Array<FormElement<any> | FormElementGroup<any> | FormElementCollection> {
        const result = [];
        arr.forEach(item => {
            switch ( item.type ) {
                case ClassType.ELEMENT:
                    result.push(this.buildElement(item.param as IfElementOptions<any>));
                    break;
                case ClassType.GROUP:
                    result.push(this.buildGroup(item.param as IfGroupOptions<any>));
                    break;
                case ClassType.COLLECTION:
                    result.push(this.buildCollection(item.param as IfCollectionsOptions));
                    break;
            }
        });
        return result;
    }

    private static buildElement(param: IfElementOptions<any>): FormElement<any> {
        return new FormElement<any>(param);
    }

    private static buildGroup(param: IfGroupOptions<any>): FormElementGroup<any> {
        const elementParams = (param.elements as any) as IfElementOptions<any>[];
        const elements = elementParams.map(x => this.buildElement(x));
        param.elements = elements;
        return new FormElementGroup<any>(param);
    }

    private static buildCollection(param: IfCollectionsOptions): FormElementCollection {
        const elementParams = (param.elements as any) as Array<IfGroupOptions<any> | IfElementOptions<any>>;
        const elements = [];
        elementParams.forEach(x => {
            if ( x.hasOwnProperty('elements') ) {
                elements.push(this.buildGroup(x as IfGroupOptions<any>));
            } else {
                elements.push(this.buildElement(x as IfElementOptions<any>));
            }
        });
        param.elements = elements;
        return new FormElementCollection(param);
    }


}
