import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { FormElement } from './element.model';
import { FormElementGroup } from './group.model';
import { FormElementCollection } from './collection.model';

import { IfRelation } from '../types/configs.type';
import { IfFrameOptions } from '../types/options.type';
import { RelationMethod } from '../types/params.type';

export class FormFrame {

    private relation$: Subject<any> = new Subject();
    private relationList: IfRelation[] = [];
    private preValues: any;

    public form: FormGroup;
    public elements: Array<FormElement<any> | FormElementGroup<any> | FormElementCollection>;
    public relationChanges: Observable<any> = this.relation$.asObservable();

    private changeEnd$: Subject<boolean> = new Subject();

    constructor(options: IfFrameOptions) {
        this.elements = options.elements;
        this.sortElements();
        this.setElementsParent();
        this.form = new FormGroup(this.getFields());
        this.preValues = this.form.getRawValue();
        options.detect = options.detect === undefined ? true : options.detect;
        this.launchDetection(options.detect);
    }

    // =====================================================================================
    // @ Public Methods
    // =====================================================================================

    /**
     * Input data in order to change relation value.
     * @param values Enter form rawValues
     */
    public changeRelationValue(values: any): void {
        this.relationList.forEach(relation => {
            const { base, targets, method, options } = relation;
            const { value, conditionFunc } = options;
            switch ( method ) {
                case RelationMethod.DISABLED:
                    this.doDisabled(targets, conditionFunc());
                    break;
                case RelationMethod.HIDDEN:
                    this.doHidden(targets, conditionFunc());
                    break;
                default:
                    if ( conditionFunc() ) {
                        this.doDataBinding(method, values, base, targets, value);
                    }
            }
        });
        this.preValues = values;
        this.relation$.next(values);
    }

    /**
     * Set fields of relation.
     * @param list Enter fields of relation params
     */
    public setFieldRelations(list: IfRelation[]): void {
        list.forEach(relation => this.addFieldRelation(relation));
        this.changeRelationValue(this.form.getRawValue());
    }

    /**
     * Add a new field of relation.
     * @param relation field of relation params.
     * @param detect excute changeRelationValue.
     */
    public addFieldRelation(relation: IfRelation, detect?: boolean): void {
        if ( !relation.options || !relation.options.conditionFunc ) {
            relation.options = relation.options || {};
            relation.options.conditionFunc = () => {
                return true;
            };
        }

        this.relationList.push(relation);
        this.relationList.sort((a, b) => a.idx - b.idx);

        if ( detect ) {
            this.changeRelationValue(this.form.getRawValue());
        }
    }

    /**
     * Remove specific element's relation.
     * @param element The element that you want to remove relation.
     */
    public removeFieldRelation(element: FormElement<any> | FormElementGroup<any> | FormElementCollection): void {
        const map = this.getModelMap(element);
        if ( element instanceof FormElementGroup || element instanceof FormElementCollection ) {
            element.elements.forEach(elem => this.removeFieldRelation(elem));
        }
        this.relationList = this.relationList.filter(relation => {
            const { base, targets } = relation;
            return !_.isEqual(map, base) && !Boolean(targets.find(x => _.isEqual(map, x)));
        });
    }

    /**
     * add a new element into target element.
     * @param element The element model.
     * @param target Add element to this element. The default element is FormFrame.
     */
    public addElement(
        element: FormElement<any> | FormElementGroup<any> | FormElementCollection,
        target?: FormElementGroup<any> | FormElementCollection
    ): void {

        const checkValid = (
            model: FormElement<any> | FormElementGroup<any> | FormElementCollection,
            instances: any[]
        ) => {
            return instances.some(ins => model instanceof ins);
        };

        if ( !target ) {
            const control = this.createFormControl(element);
            this.form.addControl(element.key, control);
            const idx = this.elements.findIndex(x => x.idx === element.idx);
            if ( idx !== -1 ) {
                for ( let i = idx; i < this.elements.length; i++ ) {
                    this.elements[i].idx++;
                }
            }
            this.elements.push(element);
        } else if ( target instanceof FormElementGroup && element instanceof FormElement ) {
            const control = this.createFormControl(element);
            const group = this.form.get(this.getModelMap(target));
            (group as FormArray).push(control);
            target.addElement(element);
        } else if ( target instanceof FormElementCollection && checkValid(element, [FormElement, FormElementGroup]) ) {
            const control = this.createFormControl(element);
            const collection = this.form.get(this.getModelMap(target));
            (collection as FormGroup).addControl(element.key, control);
            target.addElement(element as any);
        }
        this.setElementsParent();
        this.sortElements();
    }

    /**
     * Remove specific element.
     * @param element The element that you want to remove.
     */
    public removeElement(element: FormElement<any> | FormElementGroup<any> | FormElementCollection): void {
        const parent = element.parent;
        const targetMap = this.getModelMap(element);
        const parentMap = targetMap.filter((x: string, idx: number) => idx < targetMap.length - 1);

        this.removeFieldRelation(element);

        if ( parentMap.length === 0 ) {
            this.form.removeControl(element.key);
            this.elements = this.elements.filter(x => x.key !== element.key);
        } else {
            const parentControl = this.form.get(parentMap);
            if ( parentControl instanceof FormArray ) {
                const elementIndex = (parent as FormElementGroup<any>).elements.findIndex(x => x.idx === element.idx);
                parentControl.removeAt(elementIndex);
                (parent as FormElementGroup<any>).removeElement(element.key);
            }
            if ( parentControl instanceof FormGroup ) {
                parentControl.removeControl(element.key);
                (parent as FormElementCollection).removeElement(element.key);
            }
        }
        this.sortElements();
    }

    /**
     * call this method when component destroyed.
     */
    public destroy(): void {
        this.changeEnd$.next(true);
        this.changeEnd$.complete();
    }

    // =====================================================================================
    // @ Private Methods - Elements
    // =====================================================================================

    /**
     * Use elements to create FormGroup params
     */
    private getFields(): any {
        const universal = {};
        this.elements.forEach(model => universal[model.key] = this.createFormControl(model));
        return universal;
    }

    private createFormControl(model: FormElement<any> | FormElementGroup<any> | FormElementCollection): AbstractControl {
        const { configs } = model;
        if ( model instanceof FormElement ) {
            const value = (model as FormElement<any>).value;
            const control = new FormControl(
                { value, disabled: configs && configs.disabled },
                model.getValidations()
            );
            return control;
        }
        if ( model instanceof FormElementGroup ) {
            const group = new FormArray([]);
            model.elements.forEach(elem => {
                const control = new FormControl(
                    { value: elem.value, disabled: elem.configs && elem.configs.disabled },
                    elem.getValidations()
                );
                group.push(control);
            });
            return group;
        }
        if ( model instanceof FormElementCollection ) {
            const collection = {};
            model.elements.forEach(elem => {
                collection[elem.key] = this.createFormControl(elem);
            });
            return new FormGroup(collection);
        }
    }

    private sortElements(): void {
        this.elements.sort((a, b) => a.idx - b.idx);
    }

    private setElementsParent(): void {
        this.elements.forEach(elem => elem.setParent(this));
    }

    // =====================================================================================
    // @ Private Methods - Relation
    // =====================================================================================

    /**
     * Match binding method.
     * @param method the field of relation method.
     * @param values form rawValues.
     * @param base the base element's path.
     * @param targets the target elements' path.
     * @param value When method is SET_VALUE, targets change this value.
     */
    private doDataBinding(method: RelationMethod, values: any, base: string[], targets: string[][], value: any): void {
        const baseModel = this.findElement(base);
        const targetModels = targets.map(target => this.findElement(target));
        const baseMap = this.getModelMap(baseModel);
        const targetMaps = targetModels.map(target => this.getModelMap(target));
        const baseVal = _.get(values, baseMap);
        const preBaseVal = _.get(this.preValues, baseMap);

        switch ( method ) {
            case RelationMethod.SET_VALUE:
                this.doSetSpecValue(values, { targetModels, targetMaps, value });
                break;
            case RelationMethod.ONE_WAY_BINDING:
                this.doOneWayBinding(values, { baseModel, targetModels, targetMaps, baseVal, preBaseVal });
                break;
            case RelationMethod.TWO_WAY_BINDING:
                this.doTwoWayBinding(values, { baseModel, targetModels, baseMap, targetMaps, baseVal, preBaseVal });
                break;
        }
    }

    /**
     * Let targets' value change to specific value.
     * @param values form rawValues.
     * @param info include targetModels, targetMaps, value.
     */
    private doSetSpecValue(values: any, info: any): void {
        const { targetModels, targetMaps, value } = info;
        const changeValue = value && {}.toString.call(value) === '[object Function]' ? value() : value;
        targetMaps.forEach((m: string[], idx: number) => {
            _.set(values, m, changeValue);
            targetModels[idx].value = changeValue;
        });
    }

    /**
     * Let targets' value be based on base's value.
     * @param values form rawValues.
     * @param info include baseModel, targetModels, targetMaps, baseVal, preBaseVal.
     */
    private doOneWayBinding(values: any, info: any): void {
        const { baseModel, targetModels, targetMaps, baseVal, preBaseVal } = info;
        if ( _.isEqual(baseVal, preBaseVal) ) { return; }
        baseModel.value = baseVal;
        targetMaps.forEach((m: string[], idx: number) => {
            const newValue = baseModel instanceof FormElementCollection && targetModels[idx] instanceof FormElementCollection
                ? this.matchCollectionData(_.get(values, m), baseVal)
                : baseVal;
            _.set(values, m, newValue);
            targetModels[idx].value = newValue;
        });
    }

    /**
     * Sync targets' value and base's value
     * @param values form rawValues.
     * @param info include baseModel, baseMap, targetModels, targetMaps, baseVal, preBaseVal.
     */
    private doTwoWayBinding(values: any, info: any): void {
        const { baseModel, targetModels, baseMap, targetMaps, baseVal, preBaseVal } = info;
        const changeTargetIdx = targetMaps.findIndex((m: string[]) => !_.isEqual(_.get(values, m), _.get(this.preValues, m)));

        if ( !_.isEqual(baseVal, preBaseVal) || changeTargetIdx === -1 ) {
            this.doOneWayBinding(values, info);
        } else {
            const val = _.get(values, targetMaps[changeTargetIdx]);
            const preVal = _.get(this.preValues, targetMaps[changeTargetIdx]);
            const isCollectionTarget = targetModels[changeTargetIdx] instanceof FormElementCollection;
            const changeProperty = Object.keys(val).find(key => !_.isEqual(val[key], preVal[key]));

            let newValue = val;
            if ( baseModel instanceof FormElementCollection && isCollectionTarget ) {
                if ( changeProperty && !baseVal.hasOwnProperty(changeProperty) ) {
                    Object.keys(baseVal).forEach(key => {
                        if ( val.hasOwnProperty(key) ) {
                            val[key] = baseVal[key];
                        }
                    });
                }
                newValue = this.matchCollectionData(baseVal, val);
            }

            _.set(values, baseMap, newValue);
            baseModel.value = _.cloneDeep(newValue);

            targetMaps.forEach((m: string[], idx: number) => {
                newValue = targetModels[idx] instanceof FormElementCollection && isCollectionTarget && idx !== changeTargetIdx
                    ? this.matchCollectionData(_.get(values, m), val)
                    : val;
                _.set(values, m, newValue);
                targetModels[idx].value = _.cloneDeep(newValue);
            });
        }
    }

    /**
     * disble targets.
     * @param targets the target elements' path.
     * @param condition disabled condition.
     */
    private doDisabled(targets: string[][], condition: boolean): void {
        const targetModels = targets.map(target => this.findElement(target));
        const targetMaps = targetModels.map(target => this.getModelMap(target));
        if ( condition ) {
            targetMaps.forEach((m: string[], idx: number) => {
                this.form.get(m).disable({ emitEvent: false });
                targetModels[idx].configs.disabled = true;
            });
        } else {
            targetMaps.forEach((m: string[], idx: number) => {
                this.form.get(m).enable({ emitEvent: false });
                targetModels[idx].configs.disabled = false;
            });
        }
    }

    /**
     * hidden targets.
     * @param targets the target elements' path.
     * @param condition hidden condition.
     */
    private doHidden(targets: string[][], condition: boolean): void {
        const targetModels = targets.map(target => this.findElement(target));
        targetModels.forEach(model => {
            model.configs.hidden = Boolean(condition);
        });
        this.doDisabled(targets, condition);
    }

    /**
     * detect value change.
     * @param detect detect change relation fields' value.
     */
    private launchDetection(detect: boolean): void {
        this.form.valueChanges.pipe(
            takeUntil(this.changeEnd$)
        ).subscribe(() => {
            if ( detect ) {
                this.changeRelationValue(this.form.getRawValue());
            } else {
                this.preValues = this.form.getRawValue();
            }
        });

        if ( detect ) {
            this.relationChanges.pipe(
                takeUntil(this.changeEnd$)
            ).subscribe(values => this.form.setValue(values, { emitEvent: false }));
        }
    }

    // =====================================================================================
    // @ Private Methods - Handler
    // =====================================================================================

    /**
     * find specific element.
     * @param keys the path of elements.
     */
    private findElement(keys: string[]): any {
        keys = [...keys];
        const firstKey = keys.shift();
        let model = this.elements.find(x => x.key === firstKey);
        for ( const key of keys ) {
            if ( model instanceof FormElement ) {
                break;
            } else if ( model instanceof FormElementCollection || model instanceof FormElementGroup ) {
                model = model.elements.find(x => x.key === key);
            }
        }
        return model;
    }

    /**
     * Get specific element model's map.
     * @param model element model.
     * @param isFull get path containing array index.
     */
    private getModelMap(model: any, isFull = false): any[] {
        let parent = model.parent;
        const map = [];
        map.push(model.key);
        while ( !(parent instanceof FormFrame) ) {
            if ( parent instanceof FormElementGroup ) {
                const idx = parent.elements.findIndex(x => x.key === model.key);
                map.push(idx, parent.key);
                if ( !isFull ) {
                    map.shift();
                }
            } else if ( parent instanceof FormElementCollection ) {
                map.push(parent.key);
            }
            parent = parent.parent;
        }
        map.reverse();
        return map;
    }


    /**
     * Let the fields in origin value refer to the values of the same fields in reference value.
     * @param origin origin value.
     * @param reference Reference value.
     */
    private matchCollectionData(origin: any, reference: any): any {
        const result = {};
        Object.keys(origin).forEach(key => {
            result[key] = reference.hasOwnProperty(key) ? reference[key] : origin[key];
        });
        return result;
    }

}
