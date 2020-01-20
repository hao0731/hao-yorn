import { FormElement } from '../models/element.model';
import { FormElementGroup } from '../models/group.model';
import { FormElementCollection } from '../models/collection.model';
import { IfConfigs, IfValidations } from './configs.type';

export interface BasicOptions {
    key: string;
    idx: number;
    configs?: IfConfigs;
}

export interface IfElementOptions<T> extends BasicOptions {
    elementType: string;
    value: T;
    validations?: IfValidations;
}

export interface IfGroupOptions<T> extends BasicOptions {
    elements: FormElement<T>[];
}

export interface IfCollectionsOptions extends BasicOptions {
    elements: Array<FormElement<any> | FormElementGroup<any>>;
}

export interface IfFrameOptions {
    detect?: boolean;
    elements: Array<FormElement<any> | FormElementGroup<any> | FormElementCollection>;
}
