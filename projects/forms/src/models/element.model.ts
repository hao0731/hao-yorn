import { Validators } from '@angular/forms';
import { ElementBase } from './base.model';
import { IfValidations } from '../types/configs.type';
import { IfElementOptions } from '../types/options.type';

export class FormElement<T> extends ElementBase {

    public elementType: string;
    public value: T;
    public validations: IfValidations = {};

    constructor(options: IfElementOptions<T>) {
        super(options);
        this.elementType = options.elementType;
        this.value = options.value;
        this.validations = options.validations || {};
    }

    public getValidations(): any[] {
        const arr = [];
        Object.keys(this.validations).forEach(key => {
            switch ( key ) {
                case 'required':
                    if ( this.validations.required ) {
                        arr.push(Validators.required);
                    }
                    break;
                case 'max':
                    arr.push(Validators.max(this.validations.max));
                    break;
                case 'min':
                    arr.push(Validators.min(this.validations.min));
                    break;
                case 'maxLength':
                    arr.push(Validators.maxLength(this.validations.maxLength));
                    break;
                case 'minLength':
                    arr.push(Validators.minLength(this.validations.minLength));
                    break;
                case 'pattern':
                    arr.push(Validators.pattern(this.validations.pattern));
                    break;
            }
        });
        return arr;
    }

}
