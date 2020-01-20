import { RelationMethod } from './params.type';

export interface IfValidations {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export interface IfConfigs {
    disabled?: boolean;
    hidden?: boolean;
    label?: string;
    placeholder?: string;
    classList?: string[];
    options?: any;
}

export interface IfRelation {
    idx: number;
    base: string[];
    targets: string[][];
    method: RelationMethod;
    conditionFunc?: () => boolean;
}
